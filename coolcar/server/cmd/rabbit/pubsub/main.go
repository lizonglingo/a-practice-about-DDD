package main

import (
	"fmt"
	"github.com/streadway/amqp"
	"time"
)

const exchange = "go_ex"

func main() {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		panic(err)
	}

	// 建 Channel Channel是client和rabbitmq连接的通路
	ch, err := conn.Channel()
	if err != nil {
		panic(err)
	}

	// 建立 exchange clear 作为中转
	err = ch.ExchangeDeclare(
		exchange,
		"fanout", // fanout 无脑转发的类型
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}

	// 让队列订阅这个 exchange
	go subscribe(conn, exchange)
	go subscribe(conn, exchange)

	i := 0
	for {
		// 每秒5个消息发往  exchange
		// 使用 队列订阅 来收
		err := ch.Publish(
			exchange, // exchange
			"",
			false,
			false,
			amqp.Publishing{
				Body: []byte(fmt.Sprintf("message %d", i)),
			},
		)
		i++
		if err != nil {
			fmt.Println(err.Error())
		}
		time.Sleep(200 * time.Millisecond)
	}
}

func subscribe(conn *amqp.Connection, ex string)  {
	ch, err := conn.Channel()
	if err != nil {
		panic(err)
	}
	defer ch.Close()

	queue, err := ch.QueueDeclare(
		"" ,	// 为空的话会自动分配
		false,  // durable
		true, // autoDelete
		false, // exlusive
		false, // noWait
		nil,   // args
	)
	if err != nil {
		panic(err)
	}
	defer ch.QueueDelete(
		queue.Name,
		false,
		false,
		false,
		)

	// 让建好的Queue去bind
	err = ch.QueueBind(
		queue.Name,
		"",
		ex,
		false,
		nil,
		)
	if err != nil {
		panic(err)
	}

	consume("c", ch, queue.Name)
}

func consume(consumer string, ch *amqp.Channel, q string) {
	msgs, err := ch.Consume(
		q,
		consumer,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}

	for msg := range msgs {
		fmt.Printf("%s %s\n", consumer, msg.Body)
	}
}
