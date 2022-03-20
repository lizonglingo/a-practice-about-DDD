package blob

import (
	"context"
	blobpb "coolcar/blob/api/gen/v1"
	"coolcar/blob/dao"
	"coolcar/shared/id"
	"github.com/docker/docker/pkg/idtools"
	"go.mongodb.org/mongo-driver/mongo"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Service struct {
	Mongo  *dao.Mongo
	Logger *zap.Logger
	blobpb.UnimplementedBlobServiceServer
}

func (s *Service) CreateBlob(ctx context.Context, request *blobpb.CreateBlobRequest) (*blobpb.CreateBlobResponse, error) {
	aid := id.AccountID(request.AccountId)
	br, err := s.Mongo.CreateBlob(c, aid)
	if err != nil {
		s.Logger.Error("cannot create blob", zap.Error(err))
		return nil, status.Error(codes.Internal, "")
	}

	// TODO: 获取图片URL
	return &blobpb.CreateBlobResponse{
		Id:       br.ID.Hex(),
		UploadUrl: br.Path,
	}, nil
}

func (s *Service) GetBlob(ctx context.Context, request *blobpb.GetBlobRequest) (*blobpb.GetBlobResponse, error) {
	br, err := s.getBlobRecord(ctx, id.BlobID(request.Id))
	if err != nil {
		return nil, err
	}
}

func (s *Service) GetBlobURL(ctx context.Context, request *blobpb.GetBlobURLRequest) (*blobpb.GetBlobURLResponse, error) {
	br, err := s.getBlobRecord(ctx, id.BlobID(request.Id))
	if err != nil {
		return nil, err
	}

	panic("implement me")
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