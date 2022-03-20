package profile

import (
	"context"
	rentalpb "coolcar/rental/api/gen/v1"
	"coolcar/rental/profile/dao"
	"coolcar/shared/auth"
	"go.mongodb.org/mongo-driver/mongo"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"time"
)

type Service struct {
	Mongo *dao.Mongo
	Logger *zap.Logger
	rentalpb.UnimplementedProfileServiceServer
}

func (s *Service) GetProfile(ctx context.Context, request *rentalpb.GetProfileRequest) (*rentalpb.Profile, error) {
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}

	p, err := s.Mongo.GetProfile(ctx, aid)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return &rentalpb.Profile{}, nil
		}
		s.Logger.Error("cannot get profile", zap.Error(err))
		return nil, status.Error(codes.Internal, "")
	}
	return p, nil
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



