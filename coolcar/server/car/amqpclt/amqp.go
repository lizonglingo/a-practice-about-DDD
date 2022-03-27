package amqpclt

import (
	"context"
	carpb "coolcar/car/api/gen/v1"
	"encoding/json"
	"fmt"
	"github.com/streadway/amqp"
)

type Publisher struct {
	ch       *amqp.Channel
	exchange string
}

func NewPublish(conn *amqp.Connection, exchange string) (*Publisher, error) {
	// 创建一个发数据的通道
	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("cannot allocate channel: %v", err)
	}

	// 将该通道接到 exchange 上
	err = ch.ExchangeDeclare(
		exchange,
		"fanout",
		true,
		false,
		false,
		false,
		nil,
		)
	if err != nil {
		return nil, fmt.Errorf("cannot declear exchange: %v", err)
	}

	return &Publisher{
		ch:       ch,
		exchange: exchange,
	}, nil
}

func (p *Publisher) Publish(ctx context.Context, carEntity *carpb.CarEntity) error {
	b, err := json.Marshal(carEntity)
	if err != nil {
		return fmt.Errorf("cannot marshal: %v", err)
	}

	err = p.ch.Publish(
		p.exchange,
		"",
		false,
		false,
		amqp.Publishing{
			Body: b,
		})
	return err
}
