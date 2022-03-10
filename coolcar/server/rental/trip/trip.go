package trip

import (
	"context"
	rentalpb "coolcar/rental/api/gen/v1"
	"go.uber.org/zap"
)

type Service struct {
	Logger *zap.Logger
	rentalpb.UnimplementedTripServiceServer
}

func (s Service) CreateTrip(ctx context.Context, request *rentalpb.CreateTripRequest) (*rentalpb.TripEntity, error) {
	panic("implement me")
}

func (s Service) GetTrip(ctx context.Context, request *rentalpb.GetTripRequest) (*rentalpb.Trip, error) {
	panic("implement me")
}

func (s Service) GetTrips(ctx context.Context, request *rentalpb.GetTripsRequest) (*rentalpb.GetTripsResponse, error) {
	panic("implement me")
}

func (s Service) UpdateTrip(ctx context.Context, request *rentalpb.UpdateTripRequest) (*rentalpb.Trip, error) {
	panic("implement me")
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



