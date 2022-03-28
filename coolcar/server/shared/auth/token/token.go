// Package token 验证token 解析 accountID.
package token

import (
	"crypto/rsa"
	"fmt"
	"github.com/dgrijalva/jwt-go"
)

// JWTTokenVerifier 实现 token verify接口.
type JWTTokenVerifier struct {
	PublicKey *rsa.PublicKey
}

// Verify 用自己的公钥去验证token是否有效.
func (jwtv *JWTTokenVerifier) Verify(token string) (string, error) {
	t, err := jwt.ParseWithClaims(token, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtv.PublicKey, nil
	})
	if err != nil {
		return "", fmt.Errorf("cannot parse token: %v\n", err)
	}
	if !t.Valid {
		return "", fmt.Errorf("token not valid\n")
	}

	claim, ok := t.Claims.(*jwt.StandardClaims)
	if !ok {
		return "", fmt.Errorf("token claim is not standard claim\n")
	}

	if err :=claim.Valid(); err != nil {
		return "", fmt.Errorf("claim not valid: %v\n", err)
	}

	// 这里的 claim.Subject 就是构造 token 是填入的 accountID
	return claim.Subject, nil
}
