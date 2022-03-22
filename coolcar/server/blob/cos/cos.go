package cos

import (
	"context"
	"fmt"
	"github.com/tencentyun/cos-go-sdk-v5"
	"io"
	"net/http"
	"net/url"
	"time"
)

type Service struct {
	client *cos.Client
	secID  string
	secKey string
}

func (s *Service) SignURL(c context.Context, method, path string, timeout time.Duration) (string, error) {
	//headMap := make(map[string][]string)
	//headMap["Content-Type"] = []string{"image/jpeg"}
	// 预签名URL

	// PresignedURLOptions 提供用户添加请求参数和请求头部
	//opt := &cos.PresignedURLOptions{
	//	// http 请求头部，传入的请求头部需包含在实际请求中，能够防止用户篡改签入此处的HTTP请求头部
	//	Header: &http.Header{},
	//}
	//
	//if method == "PUT" {
	//	// 添加请求头部，返回的预签名url只是将请求头部设置到签名里，请求时还需要自行设置对应的header。
	//	// 上传时添加请求头
	//	opt.Header.Add("Content-Type", "image/jpeg")
	//}



	presignedURL, err := s.client.Object.GetPresignedURL(c, method, path, s.secID, s.secKey, timeout, nil)
	if err != nil {
		return "", err
	}

	return presignedURL.String(), nil
}

func (s *Service) Get(c context.Context, path string) (io.ReadCloser, error) {
	resp, err := s.client.Object.Get(c, path, nil)
	var b io.ReadCloser
	if resp != nil {
		b = resp.Body
	}
	if err != nil {
		return b, err
	}
	if resp.StatusCode >= 400 {
		return b, fmt.Errorf("got err response: %+v", err)
	}
	return b, nil
}

func NewService(addr, secID, secKey string) (*Service, error) {
	// 将 examplebucket-1250000000 和 COS_REGION 修改为用户真实的信息
	// 存储桶名称，由bucketname-appid 组成，appid必须填入，可以在COS控制台查看存储桶名称。https://console.cloud.tencent.com/cos5/bucket
	// COS_REGION 可以在控制台查看，https://console.cloud.tencent.com/cos5/bucket, 关于地域的详情见 https://cloud.tencent.com/document/product/436/6224
	// "https://coolcar-1258527714.cos.ap-chengdu.myqcloud.com"
	u, err := url.Parse(addr)
	if err != nil {
		return nil, fmt.Errorf("cannot parse addr to connect to cos: %v", err)
	}
	// 用于Get Service 查询，默认全地域 service.cos.myqcloud.com
	su, err := url.Parse("https://cos.COS_REGION.myqcloud.com")
	if err != nil {
		return nil, fmt.Errorf("cannot parse addr to connect to service.cos.myqcloud.com: %v", err)
	}
	b := &cos.BaseURL{BucketURL: u, ServiceURL: su}

	//secID := "AKIDkJdhX7SXNyJPJyNWQ5UdXBajdHgpjQt7"
	//secKey := "nMglaAVaPzJODn7C2cx3tTotjJdiY8SW"

	return &Service{
		client: cos.NewClient(b, &http.Client{
			Transport: &cos.AuthorizationTransport{
				SecretID:  secID,  // 替换为用户的 SecretId，请登录访问管理控制台进行查看和管理，https://console.cloud.tencent.com/cam/capi
				SecretKey: secKey, // 替换为用户的 SecretKey，请登录访问管理控制台进行查看和管理，https://console.cloud.tencent.com/cam/capi
			},
		}),
		secID:  secID,
		secKey: secKey,
	}, nil
}
