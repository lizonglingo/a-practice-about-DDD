package sim

import (
	"context"
	carpb "coolcar/car/api/gen/v1"
	"go.uber.org/zap"
	"time"
)

// Subscriber 用来从 rabbitMQ 中收消息.
type Subscriber interface {
	Subscribe(ctx context.Context) (ch chan *carpb.CarEntity, cleanUp func(), err error)
}

// Controller 汽车控制器 用来模拟汽车.
type Controller struct {
	CarService carpb.CarServiceClient
	Subscriber Subscriber
	Logger     *zap.Logger
}

func (c *Controller) RunSimulations(ctx context.Context) {
	var cars []*carpb.CarEntity
	for {
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
	msgCh, cleanUp, err := c.Subscriber.Subscribe(ctx)
	defer cleanUp()
	if err != nil {
		c.Logger.Error("cannot subscribe rabbitMQ", zap.Error(err))
		return
	}

	// 每个channel对应一个goroutine 连接到一个具体的car上
	carChans := make(map[string]chan *carpb.Car)
	for _, car := range cars {
		ch := make(chan *carpb.Car)
		carChans[car.Id] = ch
		go c.SimulateCar(context.Background(), car, ch)
	}

	// 收车的信息 向各个车对应的管道中分发
	for carUpdate := range msgCh {
		ch := carChans[carUpdate.Id]
		if ch != nil {
			ch <- carUpdate.Car
		}
	}
}

// SimulateCar goroutine 在开启后 等待channel中来消息进行处理.
func (c *Controller) SimulateCar(ctx context.Context, initial *carpb.CarEntity, ch chan *carpb.Car) {
	carID := initial.Id
	c.Logger.Info("Simulating car.", zap.String("id", carID))

	for update := range ch {
		if update.Status == carpb.CarStatus_UNLOCKING {
			_, err := c.CarService.UpdateCar(ctx, &carpb.UpdateCarRequest{
				Id:     carID,
				Status: carpb.CarStatus_UNLOCKED,
			})
			if err != nil {
				c.Logger.Error("cannot unlock car", zap.Error(err))
			}
		} else if update.Status == carpb.CarStatus_LOCKING {
			_, err := c.CarService.UpdateCar(ctx, &carpb.UpdateCarRequest{
				Id:     carID,
				Status: carpb.CarStatus_LOCKED,
			})
			if err != nil {
				c.Logger.Error("cannot lock car", zap.Error(err))
			}
		}
	}
}
