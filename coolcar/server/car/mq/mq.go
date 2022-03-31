package mq

import (
	"context"
	carpb "coolcar/car/api/gen/v1"
)

// Subscriber 用来从 rabbitMQ 中收消息.
type Subscriber interface {
	Subscribe(ctx context.Context) (ch chan *carpb.CarEntity, cleanUp func(), err error)
}


type Publisher interface {
	Publish(ctx context.Context, carEntity *carpb.CarEntity) error
}