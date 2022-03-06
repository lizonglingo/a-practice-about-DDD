package token

import (
	"crypto/rsa"
	"github.com/dgrijalva/jwt-go"
	"time"
)

type JWTTokenGen struct {
	privateKey  *rsa.PrivateKey
	issue       string
	nowTimeFunc func() time.Time
}

func NewJWTTokenGen(issue string, privateKey *rsa.PrivateKey) *JWTTokenGen {
	return &JWTTokenGen{
		privateKey:  privateKey,
		issue:       issue,
		nowTimeFunc: time.Now,
	}
}

func (j *JWTTokenGen) GenerateToken(accountID string, expire time.Duration) (string, error) {
	nowSec := j.nowTimeFunc().Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodRS512, jwt.StandardClaims{
		Issuer:    j.issue,
		IssuedAt:  nowSec,
		ExpiresAt: nowSec + int64(expire.Seconds()),
		Subject:   accountID,
	})

	return token.SignedString(j.privateKey)
}
