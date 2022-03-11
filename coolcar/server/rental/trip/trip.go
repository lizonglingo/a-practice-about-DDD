package trip

import (
	"context"
	rentalpb "coolcar/rental/api/gen/v1"
	"coolcar/rental/trip/dao"
	"coolcar/shared/auth"
	"coolcar/shared/id"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Service struct {
	Logger *zap.Logger
	Mongo  *dao.Mongo
	rentalpb.UnimplementedTripServiceServer
}

func (s *Service) CreateTrip(ctx context.Context, request *rentalpb.CreateTripRequest) (*rentalpb.TripEntity, error) {
	panic("implement me")
}

func (s *Service) GetTrip(ctx context.Context, request *rentalpb.GetTripRequest) (*rentalpb.Trip, error) {
	panic("implement me")
}

func (s *Service) GetTrips(ctx context.Context, request *rentalpb.GetTripsRequest) (*rentalpb.GetTripsResponse, error) {
	panic("implement me")
}

func (s *Service) UpdateTrip(ctx context.Context, request *rentalpb.UpdateTripRequest) (*rentalpb.Trip, error) {
	// 首先把 trip 拿出
	// 从 context 使用 token 拿到 accountID
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "")
	}

	tid := id.TripID(request.Id)
	tr, err := s.Mongo.GetTrip(ctx, tid, aid)

	if request.Current != nil {	// 说明当前位置变了
		tr.Trip.Current = s.calcCurrentStatus(tr.Trip, request.Current)
	}
	if request.EndTrip {		// 说明行程已经结束
		tr.Trip.End = tr.Trip.Current
		tr.Trip.Status = rentalpb.TripStatus_FINISHED
	}

	s.Mongo.UpdateTrip(ctx, tid, aid, tr.UpdatedAt, tr.Trip)
}

func (s *Service) calcCurrentStatus(trip *rentalpb.Trip, cur *rentalpb.Location) *rentalpb.LocationStatus {
	return nil
}

//func (s *Service) CreateTrip(ctx context.Context, request *rentalpb.CreateTripRequest) (*rentalpb.CreateTripResponse, error) {
//	// get accountID from context
//	aid, err := auth.AccountIDFromContext(ctx)
//	if err != nil {
//		return nil, err
//	}
//	s.Logger.Info("create trip", zap.String("start", request.Start), zap.String("account_id", aid.String()))
//	return nil, status.Errorf(codes.Unimplemented, "")
//}
