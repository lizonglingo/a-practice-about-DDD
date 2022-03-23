// 使用 aliyun 接口重新实现对象存储服务
package aliyun_oss

import (
	"bytes"
	"context"
	"fmt"
	"github.com/aliyun/aliyun-oss-go-sdk/oss"
	"io"
	"io/ioutil"
	"net/http"
	"time"
)

type Service struct {
	client *oss.Client
	secID  string
	secKey string
	endPoint string
	bucketName string
}

// SignURL 获取签名的上传或者访问URL.
func (s *Service) SignURL(c context.Context, method, path string, timeout time.Duration) (string, error) {

	// 获取存储空间。
	bucket, err := s.client.Bucket(s.bucketName)
	if err != nil {
		return "", err
	}
	signedURL := ""
	options := []oss.Option{
		oss.ContentType("image/jpeg"),
	}
	if method == "GET" {
		// 这里尝试将 time.Duration 转 int64 的 秒 表示
		signedURL, err = bucket.SignURL(path, http.MethodGet, int64(timeout.Seconds()), options...)
		if err != nil {
			return "", err
		}
	}

	if method == "PUT" {
		signedURL, err = bucket.SignURL(path, http.MethodPut, int64(timeout.Seconds()), options...)
		if err != nil {
			return "", err
		}
	}
	// 拿到正确的URL返回
	return signedURL, nil
}


func (s *Service) Get(c context.Context, path string) (io.ReadCloser, error) {

	// 首先获取 bucket
	bucket, err := s.client.Bucket(s.bucketName)
	if err != nil {
		return nil, err
	}

	// 获取对象消息流
	body, err := bucket.GetObject(path, nil)
	if err != nil {
		return nil, err
	}
	defer body.Close()

	// 从响应中读数据到data
	data, err := ioutil.ReadAll(body)

	// []byte 转 readCloser
	rc := ioutil.NopCloser(bytes.NewReader(data))


	return rc, nil
}

func NewService(endpoint, akID, akSec, bucketname string) (*Service, error) {

	client, err := oss.New(endpoint, akID, akSec)
	if err != nil {
		return nil, fmt.Errorf("cannot connect to oss storage: %v", err)
	}

	return &Service{
		client:    	client,
		secID:      akID,
		secKey:     akSec,
		endPoint:   endpoint,
		bucketName: bucketname,
	}, nil

}


