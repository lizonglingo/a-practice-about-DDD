package trip

import (
	"context"
	rentalpb "coolcar/rental/api/gen/v1"
	"coolcar/rental/trip/dao"
	"coolcar/shared/auth"
	"coolcar/shared/id"
	"coolcar/shared/mongo/objid"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"math/rand"
	"time"
)

type Service struct {
	ProfileManager ProfileManager
	CarManager     CarManager
	POIManager     POIManager
	DistanceCalc   DistanceCalc
	Logger         *zap.Logger
	Mongo          *dao.Mongo
	rentalpb.UnimplementedTripServiceServer
}

// ProfileManager defines ACL - Anti Corruption Layer for profile verify.
type ProfileManager interface {
	Verify(context.Context, id.AccountID) (id.IdentityID, error)
}

type CarManager interface {
	Verify(ctx context.Context, cid id.CarID, loc *rentalpb.Location) error
	Unlock(ctx context.Context, cid id.CarID, aid id.AccountID, tid id.TripID, avatarURL string) error
	Lock(ctx context.Context, cid id.CarID) error
}

type POIManager interface {
	Resolve(context.Context, *rentalpb.Location) (string, error)
}

type DistanceCalc interface {
	DistanceKm(context.Context, *rentalpb.Location, *rentalpb.Location) (float64, error)
}

func (s *Service) CreateTrip(ctx context.Context, request *rentalpb.CreateTripRequest) (*rentalpb.TripEntity, error) {
	// 验证身份
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}

	if request.CarId == "" || request.Start == nil {
		return nil, status.Error(codes.InvalidArgument, "")
	}

	// 验证驾驶者身份
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

	ls := s.calcCurrentStatus(ctx, &rentalpb.LocationStatus{
		Location:     request.Start,
		TimestampSec: nowFunc(),
	}, request.Start)

	// 创建行程 写入数据库
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
		err = s.CarManager.Unlock(context.Background(), carID, aid, objid.ToTripID(trip.ID),request.AvatarUrl)
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
	// 验证身份
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}

	tr, err := s.Mongo.GetTrip(ctx, id.TripID(request.Id), aid)
	if err != nil {
		return nil, status.Error(codes.NotFound, "")
	}
	return tr.Trip, nil
}

func (s *Service) GetTrips(ctx context.Context, request *rentalpb.GetTripsRequest) (*rentalpb.GetTripsResponse, error) {
	// 验证身份
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}

	tripRecords, err := s.Mongo.GetTrips(ctx, aid, request.Status)
	if err != nil {
		s.Logger.Error("cannot get trips", zap.Error(err))
		return nil, status.Error(codes.Internal, "")
	}
	res := &rentalpb.GetTripsResponse{}
	for _, tripRecord := range tripRecords {
		res.Trips = append(res.Trips, &rentalpb.TripEntity{
			Id:   tripRecord.ID.Hex(),
			Trip: tripRecord.Trip,
		})
	}
	return res, nil
}

func (s *Service) UpdateTrip(ctx context.Context, request *rentalpb.UpdateTripRequest) (*rentalpb.Trip, error) {
	// 首先把 trip 拿出
	// 从 context 使用 token 拿到 accountID
	aid, err := auth.AccountIDFromContext(ctx)
	if err != nil {
		return nil, err
	}

	tid := id.TripID(request.Id)
	// 1. 试想，发生写冲突，请求A和请求B读出同一状态a的Trip，记为Trip_a
	tr, err := s.Mongo.GetTrip(ctx, tid, aid)
	if err != nil {
		return nil, status.Error(codes.NotFound, "")
	}

	if tr.Trip.Status == rentalpb.TripStatus_FINISHED {
		return nil, status.Error(codes.FailedPrecondition, "cannot update a finished trip")
	}

	if tr.Trip.Current == nil {
		s.Logger.Error("trip without current set", zap.String("trip id", tid.String()))
		return nil, status.Error(codes.Internal, "")
	}

	// 如果位置没动，当前位置就还是在数据库中拿出来的位置
	cur := tr.Trip.Current.Location
	if request.Current != nil {
		cur = request.Current
	}

	tr.Trip.Current = s.calcCurrentStatus(ctx, tr.Trip.Current, cur)

	if request.EndTrip { // 说明行程已经结束
		tr.Trip.End = tr.Trip.Current
		tr.Trip.Status = rentalpb.TripStatus_FINISHED
		err := s.CarManager.Lock(ctx, id.CarID(tr.Trip.CarId))
		if err != nil {
			return nil, status.Errorf(codes.FailedPrecondition, "cannot lock car: %v", err)
		}
	}
	// 2. 请求A发生了一些问题，导致请求B在请求A的这一行执行前已经完成更新了
	// 3. 那么此时的tr.UpdateAt已经被修改掉，在mongo中找不到这条数据了
	// 4. 因此A更新失败，要进行重试，避免了写冲突导致的数据不一致
	err = s.Mongo.UpdateTrip(ctx, tid, aid, tr.UpdatedAt, tr.Trip)
	if err != nil {
		s.Logger.Error("update trip error", zap.Error(err))
	}



	return tr.Trip, nil
}

var nowFunc = func() int64 {
	return time.Now().Unix()
}

const centsPerSec = 0.7

func (s *Service) calcCurrentStatus(c context.Context, last *rentalpb.LocationStatus, cur *rentalpb.Location) *rentalpb.LocationStatus {
	now := nowFunc()
	elapsedSec := float64(nowFunc() - last.TimestampSec)
	dist, err := s.DistanceCalc.DistanceKm(c, last.Location, cur)
	if err != nil {
		s.Logger.Error("cannot calculate distance", zap.Error(err))
	}

	poi, err := s.POIManager.Resolve(c, cur)
	if err != nil {
		s.Logger.Info("cannot resolve poi", zap.Stringer("location", cur))
	}

	return &rentalpb.LocationStatus{
		Location: cur,
		FeeCent:  last.FeeCent + int32(centsPerSec*elapsedSec*2*rand.Float64()),
		KmDriven: last.KmDriven + dist,
		TimestampSec: now,
		PoiName: poi,
	}
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
