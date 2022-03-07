package auth

import (
	"context"
	authpb "coolcar/auth/api/gen/v1"
	"coolcar/auth/dao"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"time"
)

type Service struct {
	Logger         *zap.Logger // 用来记录日志
	Mongo          *dao.Mongo  // 使用数据库的表 account
	TokenGenerator TokenGenerator
	TokenExpire    time.Duration
	OpenIDResolver OpenIDResolver // 用来将获取到的 Request 中的 code 转化为 openId
	authpb.UnimplementedAuthServiceServer
}

type OpenIDResolver interface {
	Resolve(code string) (string, error) // use code get openId
}

type TokenGenerator interface {
	GenerateToken(accountID string, expire time.Duration) (string, error)
}

func (s *Service) Login(ctx context.Context, request *authpb.LoginRequest) (*authpb.LoginResponse, error) {
	s.Logger.Info("received code", zap.String("code", request.Code))
	openID, err := s.OpenIDResolver.Resolve(request.Code)
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "cannot resolve openID: %v\n", err)
	}

	accountID, err := s.Mongo.ResolveAccountID(ctx, openID) // openID 对应 mongo 中的 object.id 就是 accountID
	if err != nil {
		s.Logger.Error("cannot resolve account id", zap.Error(err))
		return nil, status.Errorf(codes.Internal, "")
	}

	tkn, err := s.TokenGenerator.GenerateToken(accountID, s.TokenExpire)
	if err != nil {
		s.Logger.Error("cannot generate token", zap.Error(err))
		return nil, status.Errorf(codes.Internal, "")
	}

	return &authpb.LoginResponse{
		AccessToken: tkn,
		ExpiresIn:   int32(s.TokenExpire.Seconds()),
	}, nil
}
