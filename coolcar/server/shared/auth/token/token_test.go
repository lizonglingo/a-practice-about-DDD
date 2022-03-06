package token

import (
	"github.com/dgrijalva/jwt-go"
	"testing"
	"time"
)

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1gzC1RS4aEDqXTB+/mei
TeRONQv2p4xvh/6NWK/VMh+ZR3ThBYhPVnTex9H7vvcJlodJiz+BCmLxgFvCStGJ
VNMP8SI6kyFwdniwUHNMGd78lf0QcUJ8/Pz9tRUMoQw5fx4UDrVYUUkn5zrRDA2z
WIpjvQS+KZDIndLnz6pGBy+mapV3qalkGwH6K3vjzAytr/nezUQfxyTNHzE82fuF
wn7sH3NAv8/9SPheHjhCytLDVEaCd44BeaQ6bPIrMPZAZih+7i9TP3jJawRpoH+D
ryAMvrDl+EdnTKL7Lub1HLlGGHemnXLj8aIUTadgYJSBz1WtHT5pdye6SyGnd+96
zwIDAQAB
-----END PUBLIC KEY-----`

func TestJWTTokenVerifier(t *testing.T) {
	key, err := jwt.ParseRSAPublicKeyFromPEM([]byte(publicKey))
	if err != nil {
		t.Fatalf("cannot pares public key: %v\n", err)
	}

	v := &JWTTokenVerifier{
		PublicKey: key,
	}

	tkn := "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTYyNDYyMjIsImlhdCI6MTUxNjIzOTAyMiwiaXNzIjoiY29vbGNhci9hdXRoIiwic3ViIjoiMTIzNDU2Nzg5MCJ9.qWGJsIKLAENRujOBQRqw75UuReJS0N-adQvPhrl9XovrjYhJnixEX_RUcl9hOl0K8W2MuUNkLnMxWX9KmVUyBr6cwz7En6ADXfSLqngMfWzuOGp5mHGRicV9z9Yk5uVOSolprQODThfAVXxknsFFDaGav4KR8eP1lT8foBRwlg9YNQCYqNnOSLE4dsSAsW_T5KWzqQDLchvL616mzIArwNetAjqgpX2hWYbBF_Pmes8oM68izXLlyoMawp_YRpwlYqim9Yd2nVBS_d5wDRQFdXOoWhDGTT1gQjKfbdaauM-aD8ViaGEX5RW1_E11pPRCFMR_3yO2M8ajEWWcJZGIjQ"

	cases := []struct{
		name string
		tkn string
		now time.Time
		want string
		wantErr bool
	}{
		{
			name: "valid_token",
			tkn: tkn,
			now: time.Unix(1516239122, 0),
			want: "1234567890",
			wantErr: false,
		},
		{
			name: "token_expired",
			tkn: tkn,
			now: time.Unix(1516299122, 0),
			wantErr: true,
		},
		{
			name: "bad_token",
			tkn: "ban_token",
			now: time.Unix(1516299122, 0),
			wantErr: true,
		},
		{
			name: "wrong_signature",
			tkn: "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTYyNDYyMjIsImlhdCI6MTUxNjIzOTAyMiwiaXNzIjoiY29vbGNhci9hdXRoIiwic3ViIjoiMTIzNDU2Nzg5MSJ9.qWGJsIKLAENRujOBQRqw75UuReJS0N-adQvPhrl9XovrjYhJnixEX_RUcl9hOl0K8W2MuUNkLnMxWX9KmVUyBr6cwz7En6ADXfSLqngMfWzuOGp5mHGRicV9z9Yk5uVOSolprQODThfAVXxknsFFDaGav4KR8eP1lT8foBRwlg9YNQCYqNnOSLE4dsSAsW_T5KWzqQDLchvL616mzIArwNetAjqgpX2hWYbBF_Pmes8oM68izXLlyoMawp_YRpwlYqim9Yd2nVBS_d5wDRQFdXOoWhDGTT1gQjKfbdaauM-aD8ViaGEX5RW1_E11pPRCFMR_3yO2M8ajEWWcJZGIjQ",
			now: time.Unix(1516239122, 0),
			// want: "",
			wantErr: true,
		},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			// 控制 JWT 的时间
			jwt.TimeFunc = func() time.Time {
				return c.now
			}
			accountID, err := v.Verify(c.tkn)
			if !c.wantErr && err != nil {
				t.Errorf("verification failed: %v\n", err)
			}

			if c.wantErr && err == nil {
				t.Errorf("want err, got no err")
			}
			if accountID != c.want {
				t.Errorf("wrong account id, want: %q  got: %q\n", c.want, accountID)
			}


		})
	}

}