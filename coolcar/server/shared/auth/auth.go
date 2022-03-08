package auth

import (
	"context"
	"coolcar/shared/auth/token"
	"fmt"
	jwt "github.com/dgrijalva/jwt-go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"io/ioutil"
	"os"
	"strings"
)

const (
	authorizationHeader = "authorization"
	bearerPrefix = "Bearer "

)

// Interceptor create a new grpc auth interceptor.
func Interceptor(publicKeyFile string) (grpc.UnaryServerInterceptor, error) {
	f, err := os.Open(publicKeyFile)
	if err != nil{
		return nil, fmt.Errorf("cannot open public key file: %v\n", publicKeyFile)
	}
	b, err := ioutil.ReadAll(f)
	if err != nil{
		return nil, fmt.Errorf("cannot read public key file: %v\n", publicKeyFile)
	}

	pubKey, err := jwt.ParseRSAPublicKeyFromPEM(b)
	if err != nil {
		return nil, fmt.Errorf("cannot parse publicKey: %v\n", err)
	}

	i := &interceptor{
		verifier: &token.JWTTokenVerifier{
			PublicKey: pubKey,
		},
	}
	return i.HandleRequest, nil
}

type tokenVerify interface {
	Verify(token string) (string, error)
}

// interceptor 拦截http请求进行身份验证.
type interceptor struct {
	verifier tokenVerify
}

// HandleRequest 作为请求拦截处理器，返回的handler是接下来需要做的处理函数.
func (i *interceptor) HandleRequest(ctx context.Context,
									req interface{},
									info *grpc.UnaryServerInfo,
									handler grpc.UnaryHandler) (resp interface{}, err error)  {
	// 从最初的context中拿到token
	tkn, err := tokenFromContext(ctx)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "")	// 如果没拿到token 后续的解析token的服务不会被执行
	}

	accountID, err := i.verifier.Verify(tkn)
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "token not valid: %v", err)	// 如果没拿到token 后续的解析token的服务不会被执行
	}

	// 拦截器捕获context 取出token
	// 验证token 获取accountID
	// 将 accountID 放进context
	// 把 新的context传下去 才真正交给 trip 的 createTrip执行
	return handler(ContextWithAccountID(ctx, accountID), req)
}

// tokenFromContext 从context中拿到token并返回.
func tokenFromContext(c context.Context) (string, error) {
	m, ok := metadata.FromIncomingContext(c)	// 查看请求有没有数据
	if !ok {
		return "", status.Error(codes.Unauthenticated, "")
	}

	tkn := ""
	for _, v := range m[authorizationHeader] {
		if strings.HasPrefix(v, bearerPrefix) {
			tkn = v[len(bearerPrefix):]
		}
	}
	if tkn == "" {
		return "", status.Error(codes.Unauthenticated, "")
	}
	return tkn, nil
}

type accountIDKey struct {

}



// ContextWithAccountID 将accountID写入context.
func ContextWithAccountID(c context.Context, aid string) context.Context {
	return context.WithValue(c, accountIDKey{}, aid)
}

// AccountIDFromContext 从context中将accountID取出.
func AccountIDFromContext(c context.Context) (string, error) {
	v := c.Value(accountIDKey{})
	aid, ok:= v.(string)
	if !ok {
		return "", status.Error(codes.Unauthenticated, "")
	}
	return aid, nil
}