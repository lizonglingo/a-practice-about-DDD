package wechat

import (
	"fmt"
	"github.com/medivhzhan/weapp/v2"
)

type Service struct {
	AppID     string
	AppSecret string
}

// Resolve 通过微信的接口获取openID.
func (s *Service) Resolve(code string) (string, error) {
	response, err := weapp.Login(s.AppID, s.AppSecret, code)
	if err != nil {
		return "", fmt.Errorf("weapp.Login: %v\n", err)
	}

	// response 本身也会出错
	if err = response.GetResponseError(); err != nil {
		return "", fmt.Errorf("weapp response error: %v\n",err)
	}

	return response.OpenID, nil
}
