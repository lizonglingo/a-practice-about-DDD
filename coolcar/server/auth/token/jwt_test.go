package token

import (
	"github.com/dgrijalva/jwt-go"
	"testing"
	"time"
)

const priKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA1gzC1RS4aEDqXTB+/meiTeRONQv2p4xvh/6NWK/VMh+ZR3Th
BYhPVnTex9H7vvcJlodJiz+BCmLxgFvCStGJVNMP8SI6kyFwdniwUHNMGd78lf0Q
cUJ8/Pz9tRUMoQw5fx4UDrVYUUkn5zrRDA2zWIpjvQS+KZDIndLnz6pGBy+mapV3
qalkGwH6K3vjzAytr/nezUQfxyTNHzE82fuFwn7sH3NAv8/9SPheHjhCytLDVEaC
d44BeaQ6bPIrMPZAZih+7i9TP3jJawRpoH+DryAMvrDl+EdnTKL7Lub1HLlGGHem
nXLj8aIUTadgYJSBz1WtHT5pdye6SyGnd+96zwIDAQABAoIBAFboTX7Yb9scaEu3
8gf3KeX4SWyuU9JJactMpjUZBzXXsJNbuDVX1+ahgwackltB0CnG+ixId2sxKx7T
orpgAyNmorVkEWZFkHT5oZS4i3CBogp/+loSBc9uJNCOIFePMBUVsE0cgiRW0JXI
wrHjKitL3R0UvOUBfQLfa/FcEBzAFK/V9PZRJU8rq9qfqQXi68LV/U3rAwKwkt8H
OGAdjADJ+ZNoelquE42q9WD+Tmr6PxMySRJEAZno9reey08bPGGqk8d/bNhhecmh
3GTRgQb+veCSK9PaIX+tzpnnrVKd9foMDVM+0S3nM9IcdL7H9DwR/VfLOvCbrVQ6
n3V5+CECgYEA91pfi/XJktZwBJn/8bumDaZnFAgQ5SuUi7alwi5f3IMxSA4wqKzk
ErkE1BKDdoU5VIGCRRpS5NqQtZnqmrnwvPHgdpBNc5uu/IonqxEo2Yxq7Deh3g1h
0dNwhkWSRudpPvel6UuXlAgc8CliXpRXdizzTMvwt6E2e+TTar1+NPECgYEA3YhZ
WygyynaAl+0ZH8H0EGHClj3aAZt2L/XHAkNC9Mboo178cQCW+0avGKy0LaG2UGXn
V+wDNOLIM356HDyoD9oAptIXDdmzP11qpqfB0pYVGv4bKK+Q0jsLM3uuBteGud0K
WrkOxQ7MCh++wASg/u9DEPA70l/03J1bN/v5q78CgYAzMaUs1oYNugwdJ7JtWaUY
liQnZTP5+ncYI4lTEz4L6as9epJflsjthxWUvvAui4w+DT/lBXm6m/HvZBfGRk2p
DXajk2I0Vzh0VDO5mCeYPxOyKCF8T9C7GMPlRmjr++Ewgxj3nAmXPcaffjE52gHw
F4WTk3ISz27zXXzUTrvcQQKBgF6bYC3B2Q8F1J0NMHGTjvuABG3NNFEDZ1HMEJUy
zGFkoO1EH2LS8aeV5CkReFEUgpuLKWUu8Z+gSgdTuCpe7Rb37tdPWXEcy6P/7RAH
DIs2dQT2B/s0HxDpDjuKUiOx32N4tndQGLKnQxP/wqKWV3sICwgs0B9jw1qECPS7
s0BZAoGBAMHQty31HxQ3/pOw/4rUUEMKuUddQakqa7OAa8aTuHiui4qC7XWNnJsA
YzNpigIDY//5Qc+sQB6mgDpYqOdtAnOibfiJ8QoDyBnTPwh/28+X8HRYXsFnHnCf
Ikc+Zv5nERibg7YDTG5y4Dl223eNxRX3RA3c6Png6IejUoipDZph
-----END RSA PRIVATE KEY-----`

func TestJWTTokenGen(t *testing.T) {
	key, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(priKey))
	if err != nil {
		t.Fatalf("cannot parse private key: %v\n", err)
	}
	g := NewJWTTokenGen("coolcar/auth", key)
	g.nowTimeFunc = func() time.Time {
		return time.Unix(1516239022, 0)	// 将测试时间进行固定
	}

	token, err := g.GenerateToken("1234567890", 2*time.Hour)
	if err != nil {
		t.Errorf("cannot generate token: %v\n", err)
	}

	want := "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTYyNDYyMjIsImlhdCI6MTUxNjIzOTAyMiwiaXNzIjoiY29vbGNhci9hdXRoIiwic3ViIjoiMTIzNDU2Nzg5MCJ9.qWGJsIKLAENRujOBQRqw75UuReJS0N-adQvPhrl9XovrjYhJnixEX_RUcl9hOl0K8W2MuUNkLnMxWX9KmVUyBr6cwz7En6ADXfSLqngMfWzuOGp5mHGRicV9z9Yk5uVOSolprQODThfAVXxknsFFDaGav4KR8eP1lT8foBRwlg9YNQCYqNnOSLE4dsSAsW_T5KWzqQDLchvL616mzIArwNetAjqgpX2hWYbBF_Pmes8oM68izXLlyoMawp_YRpwlYqim9Yd2nVBS_d5wDRQFdXOoWhDGTT1gQjKfbdaauM-aD8ViaGEX5RW1_E11pPRCFMR_3yO2M8ajEWWcJZGIjQ"
	if token != want {
		t.Errorf("wrong token generated want: %q, got: %q", want, token)
	}
}