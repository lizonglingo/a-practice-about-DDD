package car

import (
	"context"
	carpb "coolcar/car/api/gen/v1"
	"coolcar/car/dao"
	"coolcar/car/mq"
	"coolcar/shared/id"
	"go.mongodb.org/mongo-driver/mongo"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Service struct {
	Logger    *zap.Logger
	Mongo     *dao.Mongo
	Publisher mq.Publisher
	carpb.UnimplementedCarServiceServer
}

func (s *Service) CreateCar(ctx context.Context, request *carpb.CreateCarRequest) (*carpb.CarEntity, error) {
	cr, err := s.Mongo.CreateCar(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &carpb.CarEntity{
		Id:  cr.ID.Hex(),
		Car: cr.Car,
	}, nil
}

func (s *Service) GetCar(ctx context.Context, request *carpb.GetCarRequest) (*carpb.Car, error) {
	cr, err := s.Mongo.GetCar(ctx, id.CarID(request.Id))
	if err != nil {
		return nil, status.Error(codes.NotFound, "")
	}
	return cr.Car, nil
}

func (s *Service) GetCats(ctx context.Context, request *carpb.GetCarsRequest) (*carpb.GetCarsResponse, error) {
	crs, err := s.Mongo.GetCars(ctx)
	if err != nil {
		s.Logger.Error("cannot get cars", zap.Error(err))
		return nil, status.Error(codes.Internal, "")
	}

	res := &carpb.GetCarsResponse{}
	for _, cr := range crs {
		res.Cars = append(res.Cars, &carpb.CarEntity{
			Id:  cr.ID.Hex(),
			Car: cr.Car,
		})
	}
	return res, nil
}

func (s *Service) LockCar(ctx context.Context, request *carpb.LockCarRequest) (*carpb.LockCarResponse, error) {
	// 注意 锁车的前置条件是： 车是处于 unlock状态的
	cr, err := s.Mongo.UpdateCar(ctx, id.CarID(request.Id), carpb.CarStatus_UNLOCKED, &dao.CarUpdate{
		Status: carpb.CarStatus_LOCKING,
	})
	if err != nil {
		code := codes.Internal
		if err == mongo.ErrNoDocuments {
			code = codes.NotFound
		}
		return nil, status.Errorf(code, "cannot update %v", err)
	}

	s.publish(ctx, cr)
	return &carpb.LockCarResponse{}, nil
}

func (s *Service) UnlockCar(ctx context.Context, request *carpb.UnlockCarRequest) (*carpb.UnlockCarResponse, error) {
	cr, err := s.Mongo.UpdateCar(ctx, id.CarID(request.Id), carpb.CarStatus_LOCKED, &dao.CarUpdate{
		Status:       carpb.CarStatus_UNLOCKING,
		Driver:       request.Driver,
		UpdateTripID: true,
		TripID:       id.TripID(request.TripId),
	})
	if err != nil {
		code := codes.Internal
		if err == mongo.ErrNoDocuments {
			code = codes.NotFound
		}
		return nil, status.Errorf(code, "cannot update %v", err)
	}
	s.publish(ctx, cr)
	return &carpb.UnlockCarResponse{}, nil
}

func (s *Service) UpdateCar(ctx context.Context, request *carpb.UpdateCarRequest) (*carpb.UpdateCarResponse, error) {
	update := &dao.CarUpdate{
		Status:   request.Status,
		Position: request.Position,
	}

	// 如果更新的状态是上锁状态 那么就清掉一些信息
	if request.Status == carpb.CarStatus_LOCKED {
		update.Driver = &carpb.Driver{}
		update.UpdateTripID = true
		update.TripID = id.TripID("")
	}

	// 前置状态为NOT_SPECIFIED则不追加状态信息为查询条件
	// 查到什么状态的车都进行更新
	cr, err := s.Mongo.UpdateCar(ctx, id.CarID(request.Id), carpb.CarStatus_CS_NOT_SPECIFIED, update)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	s.publish(ctx, cr)
	return &carpb.UpdateCarResponse{}, nil
}

func (s *Service) publish(c context.Context, car *dao.CarRecord) {
	err := s.Publisher.Publish(c, &carpb.CarEntity{
		Id:  car.ID.Hex(),
		Car: car.Car,
	})

	if err != nil {
		s.Logger.Warn("cannot publish", zap.Error(err))
	}
}
