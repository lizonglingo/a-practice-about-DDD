package blob

import (
	"context"
	blobpb "coolcar/blob/api/gen/v1"
	"coolcar/blob/dao"
	"coolcar/shared/id"
	"go.mongodb.org/mongo-driver/mongo"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"io"
	"io/ioutil"
	"net/http"
	"time"
)

type Storage interface {
	SignURL(c context.Context, method, path string, timeout time.Duration) (string, error)
	Get(c context.Context, path string) (io.ReadCloser, error)
}

type Service struct {
	Storage Storage
	Mongo   *dao.Mongo
	Logger  *zap.Logger
	blobpb.UnimplementedBlobServiceServer
}

// CreateBlob 创建Blob 存到数据库并提交云存储 返回数据库ID 和 云储存路径.
func (s *Service) CreateBlob(ctx context.Context, request *blobpb.CreateBlobRequest) (*blobpb.CreateBlobResponse, error) {
	aid := id.AccountID(request.AccountId)
	br, err := s.Mongo.CreateBlob(ctx, aid)
	if err != nil {
		s.Logger.Error("cannot create blob", zap.Error(err))
		return nil, status.Error(codes.Internal, "")
	}

	url, err := s.Storage.SignURL(ctx, http.MethodPut, br.Path, secToDuration(request.UploadUrlTimeoutSec))
	if err != nil {
		return nil, status.Errorf(codes.Aborted, "cannot sign url: %v", err)
	}

	// TODO: 获取图片URL
	return &blobpb.CreateBlobResponse{
		Id:        br.ID.Hex(),
		UploadUrl: url,
	}, nil
}

func (s *Service) GetBlob(ctx context.Context, request *blobpb.GetBlobRequest) (*blobpb.GetBlobResponse, error) {
	// 从数据库中取path
	br, err := s.getBlobRecord(ctx, id.BlobID(request.Id))
	if err != nil {
		return nil, err
	}

	// 根据path拿内容
	readCloser, err := s.Storage.Get(ctx, br.Path)
	if readCloser != nil {
		defer readCloser.Close()
	}
	if err != nil {
		return nil, status.Errorf(codes.Aborted, "cannot get storage: %v", err)
	}

	b, err := ioutil.ReadAll(readCloser)
	if err != nil {
		return nil, status.Errorf(codes.Aborted, "cannot read from response: %v", err)
	}
	return &blobpb.GetBlobResponse{
		Data: b,
	}, nil
}

func (s *Service) GetBlobURL(ctx context.Context, request *blobpb.GetBlobURLRequest) (*blobpb.GetBlobURLResponse, error) {
	br, err := s.getBlobRecord(ctx, id.BlobID(request.Id))
	if err != nil {
		return nil, err
	}

	url, err := s.Storage.SignURL(ctx, http.MethodGet, br.Path, secToDuration(request.TimeoutSec))
	if err != nil {
		return nil, status.Errorf(codes.Aborted, "cannot sign url: %v", err)
	}

	return &blobpb.GetBlobURLResponse{Url: url}, nil
}

func (s *Service) getBlobRecord(c context.Context, bid id.BlobID) (*dao.BlobRecord, error) {
	br, err := s.Mongo.GetBlob(c, bid)
	if err == mongo.ErrNoDocuments {
		return nil, status.Error(codes.NotFound, "")
	}

	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	return br, nil
}

func secToDuration(sec int32) time.Duration {
	return time.Duration(sec) * time.Second
}
