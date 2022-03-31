package amqpclt

import (
	"context"
	carpb "coolcar/car/api/gen/v1"
	"encoding/json"
	"fmt"
	"github.com/streadway/amqp"
	"go.uber.org/zap"
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
	// publisher 和 subscribe 都要建一下 exchange
	// 防止没有建就开始送数据
	err = declearExchange(ch, exchange)
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

type Subscriber struct {
	conn     *amqp.Connection // 需要一个 connection 来建立接收消息的管道
	exchange string           // 告诉应该绑定哪一个exchange
	logger   *zap.Logger
}

func NewSubscriber(conn *amqp.Connection, exchange string, logger *zap.Logger) (*Subscriber, error) {
	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("cannot allocate channel: %v", err)
	}
	defer ch.Close() // 这个channel和subscriber中的不同 只是为了用于建exchange

	err = declearExchange(ch, exchange)
	if err != nil {
		return nil, fmt.Errorf("cannot declear exchange: %v", err)
	}

	return &Subscriber{
		conn:     conn,
		exchange: exchange,
		logger:   logger,
	}, nil
}

func (s *Subscriber) SubscribeRaw(ctx context.Context) (<-chan amqp.Delivery, func() ,error) {
	ch, err := s.conn.Channel()
	if err != nil {
		return nil, func() {}, fmt.Errorf("cannot allocate channel: %v", err)
	}
	// defer ch.Close()	// 这个channel要传出去 让外面去关
	closeCh := func() {
		err := ch.Close()
		if err != nil {
			s.logger.Error("cannot close channel: %v", zap.Error(err))
		}
	}

	// 建一个随机生成名字的 queue
	q, err := ch.QueueDeclare(
		"",
		false,
		true,
		false,
		false,
		nil,
	)
	if err != nil {
		return nil, closeCh, fmt.Errorf("cannot create queue: %v", err)
	}

	// 如果 channel 建好了 queue 也建好了 就告诉外面 关闭管道 删除 queue
	cleanUp := func() {
		_, err := ch.QueueDelete(
			q.Name,
			false,
			false,
			false,
			)
		if err != nil {
			s.logger.Error("cannot delete queue: %v", zap.String("name", q.Name), zap.Error(err))
		}
		closeCh()
	}
	// 绑定 exchange
	err = ch.QueueBind(
		q.Name,
		"",
		s.exchange,
		false,
		nil,
	)
	if err != nil {
		return nil, cleanUp, fmt.Errorf("cannot bind exchange: %v", err)
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return nil, cleanUp, fmt.Errorf("cannot consume queue: %v", err)
	}

	return msgs, cleanUp, nil
}

func (s *Subscriber) Subscribe(ctx context.Context) (chan *carpb.CarEntity, func(), error) {
	msgCh, cleanUp, err := s.SubscribeRaw(ctx)
	if err != nil {
		return nil, cleanUp, err
	}

	carCh := make(chan *carpb.CarEntity)
	go func() {
		for msg := range msgCh {
			var car carpb.CarEntity
			err := json.Unmarshal(msg.Body, &car)
			if err != nil {
				s.logger.Error("cannot unmarshal", zap.Error(err))
			}
			carCh <- &car
		}
		close(carCh)
	}()
	return carCh, cleanUp, nil
}

func declearExchange(ch *amqp.Channel, exchange string) error {
	return ch.ExchangeDeclare(
		exchange,
		"fanout",
		true,
		false,
		false,
		false,
		nil,
	)
}
