package auth

import (
	"context"
	"coolcar/shared/auth/token"
	"coolcar/shared/id"
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
	ImpersonateAccountHeader = "impersonate-account-id"
	authorizationHeader = "authorization"
	bearerPrefix = "Bearer "

)

// Interceptor create a new grpc auth interceptor.
func Interceptor(publicKeyFile string) (grpc.UnaryServerInterceptor, error) {
	// 1. 读取公钥 公钥用来验签
	f, err := os.Open(publicKeyFile)
	if err != nil{
		return nil, fmt.Errorf("cannot open public key file: %v\n", publicKeyFile)
	}
	b, err := ioutil.ReadAll(f)
	if err != nil{
		return nil, fmt.Errorf("cannot read public key file: %v\n", publicKeyFile)
	}

	// 2. 用 jwt 转为 *rsa.PublicKey
	pubKey, err := jwt.ParseRSAPublicKeyFromPEM(b)
	if err != nil {
		return nil, fmt.Errorf("cannot parse publicKey: %v\n", err)
	}

	// 3. 初始化拦截器
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

// HandleRequest 作为请求拦截处理器，返回的handler是接下来需要做的处理函数
// 根据grpc.UnaryServerInterceptor设计函数签名.
func (i *interceptor) HandleRequest(ctx context.Context,
									req interface{},
									info *grpc.UnaryServerInfo,
									handler grpc.UnaryHandler) (resp interface{}, err error)  {
	// 0. 先检查是否加入特殊身份标识
	//    如果有就相信
	//    否则从 token 中解出
	accountID := impersonationFromContext(ctx)
	if accountID != "" {
		// fmt.Printf("impersonating %q\n", accountID)
		return handler(ContextWithAccountID(ctx, id.AccountID(accountID)), req)
	}
	// 1. 在这之前已将token加入context
	//    从最初的context中拿到token
	tkn, err := tokenFromContext(ctx)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "")	// 如果没拿到token 后续的解析token的服务不会被执行
	}

	// 2. 验证token 拿到 accountID
	accountID, err = i.verifier.Verify(tkn)
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "token not valid: %v", err)	// 如果没拿到token 后续的解析token的服务不会被执行
	}

	// 3. 将 accountID 放入 context 中，交给后续的请求执行
	// 拦截器捕获context 取出token
	// 验证token 获取accountID
	// 将 accountID 放进context
	// 把 新的context传下去 才真正交给 trip 的 createTrip执行
	return handler(ContextWithAccountID(ctx, id.AccountID(accountID)), req)
}

func impersonationFromContext(c context.Context) string {
	m, ok := metadata.FromIncomingContext(c)
	if !ok {
		return ""
	}

	imp := m[ImpersonateAccountHeader]
	if len(imp) == 0 {
		return ""
	}
	return imp[0]
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
func ContextWithAccountID(c context.Context, aid id.AccountID) context.Context {
	return context.WithValue(c, accountIDKey{}, aid)
}

// AccountIDFromContext 从context中将accountID取出.
func AccountIDFromContext(c context.Context) (id.AccountID, error) {
	v := c.Value(accountIDKey{})
	aid, ok:= v.(id.AccountID)
	if !ok {
		return "", status.Error(codes.Unauthenticated, "")
	}
	return aid, nil
}