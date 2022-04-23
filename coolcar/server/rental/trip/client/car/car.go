package car

import (
	"context"
	carpb "coolcar/car/api/gen/v1"
	rentalpb "coolcar/rental/api/gen/v1"
	"coolcar/shared/id"
	"fmt"
)

type Manager struct {
	CarService carpb.CarServiceClient
}

// Verify 验证车辆状态是否处于可开锁状态.
func (m *Manager) Verify(ctx context.Context, cid id.CarID, location *rentalpb.Location) error {
	// 通过 carID 找到需要验证的车
	car, err := m.CarService.GetCar(ctx, &carpb.GetCarRequest{
		Id: cid.String(),
	})
	if err != nil {
		return fmt.Errorf("cannot get car: %v", err)
	}

	// 只有在关锁状态才能开锁
	if car.Status != carpb.CarStatus_LOCKED {
		return fmt.Errorf("cannot unlock; car status is %v", car.Status)
	}

	// 检查无误 通过验证
	return nil
}

func (m *Manager) Unlock(ctx context.Context, cid id.CarID, aid id.AccountID, tid id.TripID, avatarURL string) error {
	// fmt.Printf("trip id in trip client car.go 34: %s", tid.String())
	_, err := m.CarService.UnlockCar(ctx, &carpb.UnlockCarRequest{
		Id: cid.String(),
		Driver: &carpb.Driver{
			Id:        aid.String(),
			AvatarUrl: avatarURL,
		},
		TripId: tid.String(),
	})
	if err != nil {
		return fmt.Errorf("cannot unlock car: %v", err)
	}
	return nil
}

func (m *Manager) Lock(ctx context.Context, cid id.CarID) error {
	_, err := m.CarService.LockCar(ctx, &carpb.LockCarRequest{Id: cid.String()})
	if err != nil {
		return fmt.Errorf("cannot lock car %v", err)
	}
	return nil
}
