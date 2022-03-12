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
	ProfileManager ProfileManager
	CarManager     CarManager
	POIManager     POIManager
	Logger         *zap.Logger
	Mongo          *dao.Mongo
	rentalpb.UnimplementedTripServiceServer
}

// ProfileManager defines ACL - Anti Corruption Layer for profile verify.
type ProfileManager interface {
	Verify(context.Context, id.AccountID) (id.IdentityID, error)
}

type CarManager interface {
	Verify(context.Context, id.CarID, *rentalpb.Location) error
	Unlock(context.Context, id.CarID) error
}

type POIManager interface {
	Resolve(context.Context, *rentalpb.Location) (string, error)
}

func (s *Service) CreateTrip(ctx context.Context, request *rentalpb.CreateTripRequest) (*rentalpb.TripEntity, error) {
	// 验证身份
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}
	iID, err := s.ProfileManager.Verify(ctx, aid)
	if err != nil {
		return nil, status.Errorf(codes.FailedPrecondition, err.Error())
	}

	// 检查车辆状态 防止车辆被占用
	carID := id.CarID(request.CarId)
	err = s.CarManager.Verify(ctx, carID, request.Start)
	if err != nil {
		return nil, status.Error(codes.FailedPrecondition, err.Error())
	}

	// 创建行程	先做
	poi, err := s.POIManager.Resolve(ctx, request.Start)
	if err != nil {
		s.Logger.Info("cannot resolve poi", zap.Stringer("location", request.Start), zap.Error(err))
	}

	ls := &rentalpb.LocationStatus{
		Location: request.Start,
		PoiName:  poi,
	}
	trip, err := s.Mongo.CreateTrip(ctx, &rentalpb.Trip{
		AccountId:  aid.String(),
		CarId:      carID.String(),
		IdentityId: iID.String(),
		Status:     rentalpb.TripStatus_IN_PROGRESS,
		Start:      ls,
		Current:    ls,
	})
	if err != nil {
		s.Logger.Warn("cannot create trip", zap.Error(err))
		return nil, status.Error(codes.AlreadyExists, "")
	}

	// 开锁		后做 如果先开锁，开锁成功但创建行程失败了呢？
	// 不需要等到开完锁再告诉用户开锁成功
	go func() {
		err = s.CarManager.Unlock(context.Background(), carID)
		if err != nil {
			s.Logger.Error("cannot unlock car", zap.Error(err))
		}
	}()

	return &rentalpb.TripEntity{
		Id:   trip.ID.Hex(),
		Trip: trip.Trip,
	}, nil
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
	// 1. 试想，发生写冲突，请求A和请求B读出同一状态a的Trip，记为Trip_a
	tr, err := s.Mongo.GetTrip(ctx, tid, aid)

	if request.Current != nil { // 说明当前位置变了
		tr.Trip.Current = s.calcCurrentStatus(tr.Trip, request.Current)
	}
	if request.EndTrip { // 说明行程已经结束
		tr.Trip.End = tr.Trip.Current
		tr.Trip.Status = rentalpb.TripStatus_FINISHED
	}
	// 2. 请求A发生了一些问题，导致请求B在请求A的这一行执行前已经完成更新了
	// 3. 那么此时的tr.UpdateAt已经被修改掉，在mongo中找不到这条数据了
	// 4. 因此A更新失败，要进行重试，避免了写冲突导致的数据不一致
	s.Mongo.UpdateTrip(ctx, tid, aid, tr.UpdatedAt, tr.Trip)

	return nil, nil
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
