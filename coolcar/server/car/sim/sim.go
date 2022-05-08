package sim

import (
	"context"
	carpb "coolcar/car/api/gen/v1"
	"coolcar/car/mq"
	coolenvpb "coolcar/shared/coolenv"
	"fmt"
	"go.uber.org/zap"
	"time"
)

type PosSubscriber interface {
	Subscribe(ctx context.Context) (ch chan *coolenvpb.CarPosUpdate, cleanUp func(), err error)
}

// Controller 汽车控制器 用来模拟汽车.
type Controller struct {
	CarService    carpb.CarServiceClient
	AIService     coolenvpb.AIServiceClient // 位置模拟服务
	CarSubscriber mq.Subscriber             // 对应coolcar的exchange
	PosSubscriber PosSubscriber             // 对应pos_sim的exchange
	Logger        *zap.Logger
}

func (c *Controller) RunSimulations(ctx context.Context) {
	// 首先获取所有的汽车
	var cars []*carpb.CarEntity
	for {	// 在没有连到Server时进行重试
		// 等待3s 以免CarService Server没有启动
		time.Sleep(3 * time.Second)
		res, err := c.CarService.GetCats(ctx, &carpb.GetCarsRequest{})
		if err != nil {
			c.Logger.Error("cannot get cars", zap.Error(err))
			continue
		}
		cars = res.Cars
		break
	}

	c.Logger.Info("Running car simulations.", zap.Int("car_count", len(cars)))

	// 订阅 消息队列管道
	// 调用一次subscribe拿到通信管道后
	// MQ 源源不断的向该管道发送数据
	carCh, carCleanUp, err := c.CarSubscriber.Subscribe(ctx)
	defer carCleanUp()
	if err != nil {
		c.Logger.Error("cannot subscribe rabbitMQ on coolcar", zap.Error(err))
		return
	}

	posCh, posCleanUp, err := c.PosSubscriber.Subscribe(ctx)
	defer posCleanUp()
	if err != nil {
		c.Logger.Error("cannot subscribe rabbitMQ on pos_sim", zap.Error(err))
	}

	// 每个channel对应一个goroutine 连接到一个具体的car上
	carChans := make(map[string]chan *carpb.Car)
	posChans := make(map[string]chan *carpb.Location)
	for _, car := range cars {
		carFanoutCh := make(chan *carpb.Car)
		carChans[car.Id] = carFanoutCh
		posFanoutCh := make(chan *carpb.Location)
		posChans[car.Id] = posFanoutCh
		go c.SimulateCar(context.Background(), car, carFanoutCh, posFanoutCh)
	}

	// 收车的信息 向各个车对应的管道中分发
	// 需要同时从 car 和 pos channel 中收消息
	for {
		select {
		case carUpdate := <-carCh:
			ch := carChans[carUpdate.Id]
			if ch != nil {
				ch <- carUpdate.Car
			}
		case posUpdate := <-posCh:
			ch := posChans[posUpdate.CarId]
			if ch != nil {
				ch <- &carpb.Location{
					Latitude:  posUpdate.Pos.Latitude,
					Longitude: posUpdate.Pos.Longitude,
				}
			}
		}

	}
}

// SimulateCar goroutine 在开启后 等待channel中来消息进行处理.
// 每个car对应一个car simulation
func (c *Controller) SimulateCar(ctx context.Context, initial *carpb.CarEntity, carCh chan *carpb.Car, posCh chan *carpb.Location) {
	car := initial
	c.Logger.Info("Simulating car.", zap.String("id", car.Id))

	// 同时在两个channel中收消息
	// 所以用select
	for {
		select {
		case update := <-carCh:
			if update.Status == carpb.CarStatus_UNLOCKING {
				// c.Logger.Info("car trip id.", zap.String("trip id in sim 101", update.TripId))
				updated, err := c.unLockCar(ctx, car)
				if err != nil {
					c.Logger.Info(err.Error())
					c.Logger.Error("cannot unlock car", zap.String("id", car.Id))
					break	// 跳出case
				}
				car = updated
			} else if update.Status == carpb.CarStatus_LOCKING {
				updated, err := c.lockCar(ctx, car)
				if err != nil {
					c.Logger.Error("cannot lock car", zap.String("id", car.Id))
					break	// 跳出case
				}
				car = updated
			}
		case pos := <- posCh:
			updated, err := c.moveCar(ctx, car, pos)
			if err != nil {
				c.Logger.Error("cannot move car", zap.String("id", car.Id))
				break
			}
			car = updated
		}
	}
}

func (c *Controller) lockCar(ctx context.Context, car *carpb.CarEntity) (*carpb.CarEntity, error) {
	car.Car.Status = carpb.CarStatus_LOCKED
	_, err := c.CarService.UpdateCar(ctx, &carpb.UpdateCarRequest{
		Id:     car.Id,
		Status: carpb.CarStatus_LOCKED,
	})
	if err != nil {
		c.Logger.Info("lockCar update car error")
		return nil, fmt.Errorf("cannot update car state: %v", err)
	}

	_, err = c.AIService.EndSimulateCarPos(ctx, &coolenvpb.EndSimulateCarPosRequest{
		CarId: car.Id,
	})
	if err != nil {
		c.Logger.Info("end simulate CarPos error")
		return nil, fmt.Errorf("cannot end simulation: %v", err)
	}

	return car, nil
}

func (c *Controller) unLockCar(ctx context.Context, car *carpb.CarEntity) (*carpb.CarEntity, error) {
	car.Car.Status = carpb.CarStatus_UNLOCKED
	_, err := c.CarService.UpdateCar(ctx, &carpb.UpdateCarRequest{
		Id:     car.Id,
		Status: carpb.CarStatus_UNLOCKED,
	})
	if err != nil {
		c.Logger.Info("unlockCar update car error")
		return nil, fmt.Errorf("cannot update car state: %v", err)
	}
	// 开锁之后 汽车开始模拟移动
	_, err = c.AIService.SimulateCarPos(ctx, &coolenvpb.SimulateCarPosRequest{
		CarId: car.Id,
		Type:  coolenvpb.PosType_NINGBO,
		InitialPos: &coolenvpb.Location{
			Latitude:  car.Car.Position.Latitude,
			Longitude: car.Car.Position.Longitude,
		},
	})
	if err != nil {
		c.Logger.Info("simulate simulate CarPos error")
		return nil, fmt.Errorf("cannot simulate car position: %v", err)
	}

	return car, nil
}

func (c *Controller) moveCar(ctx context.Context, car *carpb.CarEntity, pos *carpb.Location) (*carpb.CarEntity, error) {
	car.Car.Position = pos
	_, err := c.CarService.UpdateCar(ctx, &carpb.UpdateCarRequest{
		Id: car.Id,
		Position: pos,
	})
	if err != nil {
		return nil, fmt.Errorf("cannot update car: %v", err)
	}
	return car, nil
}