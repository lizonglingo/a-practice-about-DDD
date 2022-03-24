package profile

import (
	"context"
	blobpb "coolcar/blob/api/gen/v1"
	rentalpb "coolcar/rental/api/gen/v1"
	"coolcar/rental/profile/dao"
	"coolcar/shared/auth"
	"coolcar/shared/id"
	"go.mongodb.org/mongo-driver/mongo"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"time"
)

type Service struct {
	BlobClient        blobpb.BlobServiceClient // 让 rental 连到 blob的服务 使用其服务
	PhotoGetExpire    time.Duration
	PhotoUploadExpire time.Duration
	Mongo             *dao.Mongo
	Logger            *zap.Logger
	rentalpb.UnimplementedProfileServiceServer
}

func (s *Service) GetProfile(ctx context.Context, request *rentalpb.GetProfileRequest) (*rentalpb.Profile, error) {
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}

	pr, err := s.Mongo.GetProfile(ctx, aid)
	if err != nil {
		code := s.logAndConvertProfileErr(err)
		if code == codes.NotFound {
			return &rentalpb.Profile{}, nil
		}
		return nil, status.Error(codes.Internal, "")
	}

	if pr.Profile == nil {
		return &rentalpb.Profile{}, nil
	}

	return pr.Profile, nil
}

func (s *Service) SubmitProfile(ctx context.Context, identity *rentalpb.Identity) (*rentalpb.Profile, error) {
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}

	p := &rentalpb.Profile{
		Identity:       identity,
		IdentityStatus: rentalpb.IdentityStatus_PENDING,
	}
	err = s.Mongo.UpdateProfile(ctx, aid, p, rentalpb.IdentityStatus_UNSUBMITTED)
	if err != nil {
		s.Logger.Error("cannot update profile", zap.Error(err))
		return nil, status.Error(codes.Internal, "")
	}

	// 模拟审核
	go func() {
		time.Sleep(3 * time.Second)
		// 注意context的使用
		err := s.Mongo.UpdateProfile(context.Background(), aid, &rentalpb.Profile{
			Identity:       identity,
			IdentityStatus: rentalpb.IdentityStatus_VERIFIED,
		}, rentalpb.IdentityStatus_PENDING)
		if err != nil {
			s.Logger.Error("cannot verify identity", zap.Error(err))
		}
	}()

	return p, nil
}

func (s *Service) ClearProfile(ctx context.Context, request *rentalpb.ClearProfileRequest) (*rentalpb.Profile, error) {
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}

	p := &rentalpb.Profile{}
	err = s.Mongo.UpdateProfile(ctx, aid, p, rentalpb.IdentityStatus_VERIFIED)
	if err != nil {
		s.Logger.Error("cannot update profile", zap.Error(err))
		return nil, status.Error(codes.Internal, "")
	}
	return p, nil
}

func (s *Service) GetProfilePhoto(ctx context.Context, request *rentalpb.GetProfilePhotoRequest) (*rentalpb.GetProfilePhotoResponse, error) {
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}

	profileRecord, err := s.Mongo.GetProfile(ctx, aid)
	if err != nil {
		return nil, status.Error(s.logAndConvertProfileErr(err), "")
	}

	if profileRecord.PhotoBlobID == "" {
		return nil, status.Error(codes.NotFound, "")
	}

	blobURL, err := s.BlobClient.GetBlobURL(ctx, &blobpb.GetBlobURLRequest{
		Id:         profileRecord.PhotoBlobID,
		TimeoutSec: int32(s.PhotoGetExpire.Seconds()),
	})
	if err != nil {
		s.Logger.Error("cannot get blob", zap.Error(err))
		return nil, status.Error(codes.Internal, "")
	}

	return &rentalpb.GetProfilePhotoResponse{Url: blobURL.Url}, nil
}

func (s *Service) CreateProfilePhoto(ctx context.Context, request *rentalpb.CreateProfilePhotoRequest) (*rentalpb.CreateProfilePhotoResponse, error) {
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}

	blob, err := s.BlobClient.CreateBlob(ctx, &blobpb.CreateBlobRequest{
		AccountId:           aid.String(),
		UploadUrlTimeoutSec: int32(s.PhotoUploadExpire.Seconds()),
	})
	if err != nil {
		s.Logger.Error("cannot create blob", zap.Error(err))
		return nil, status.Error(codes.Aborted, "")
	}

	// 然后把 blob id 存起来
	err = s.Mongo.UpdateProfilePhoto(ctx, aid, id.BlobID(blob.Id))
	if err != nil {
		s.Logger.Error("cannot update profile photo", zap.Error(err))
		return nil, status.Error(codes.Aborted, "")
	}

	return &rentalpb.CreateProfilePhotoResponse{
		UploadUrl: blob.UploadUrl,
	}, nil
}

func (s *Service) CompleteProfilePhoto(ctx context.Context, request *rentalpb.CompleteProfilePhotoRequest) (*rentalpb.Identity, error) {
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}

	profileRecord, err := s.Mongo.GetProfile(ctx, aid)
	if err != nil {
		return nil, status.Error(s.logAndConvertProfileErr(err), "")
	}

	if profileRecord.PhotoBlobID == "" {
		return nil, status.Error(codes.NotFound, "")
	}

	blob, err := s.BlobClient.GetBlob(ctx, &blobpb.GetBlobRequest{Id: profileRecord.PhotoBlobID})
	if err != nil {
		s.Logger.Error("cannot get blob", zap.Error(err))
		return nil, status.Error(codes.Aborted, "")
	}

	// TODO: 调用AI接口取识别图片
	s.Logger.Info("got profile photo", zap.Int("size", len(blob.Data)))
	// 所以暂时使用假数据
	return &rentalpb.Identity{
		LicNumber:       "1234321",
		Name:            "李四",
		Gender:          rentalpb.Gender_FEMALE,
		BrithDateMillis: 631152000000,
	}, nil
}

func (s *Service) ClearProfilePhoto(ctx context.Context, req *rentalpb.ClearProfilePhotoRequest) (*rentalpb.ClearProfilePhotoResponse, error) {
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}

	err = s.Mongo.UpdateProfilePhoto(ctx, aid, id.BlobID(""))
	if err != nil {
		s.Logger.Error("cannot clear profile photo", zap.Error(err))
		return nil, status.Error(codes.Internal, "")
	}
	return &rentalpb.ClearProfilePhotoResponse{}, nil
}

func (s *Service) logAndConvertProfileErr(err error) codes.Code {
	if err == mongo.ErrNoDocuments {
		return codes.NotFound
	}
	s.Logger.Error("cannot get profile", zap.Error(err))
	return codes.Internal
}
