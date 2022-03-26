package main

import (
	"fmt"
	"github.com/streadway/amqp"
	"time"
)

func main() {
	// 连接到 rabbitMQ
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		panic(err)
	}

	ch, err := conn.Channel()
	if err != nil {
		panic(err)
	}

	queue, err := ch.QueueDeclare(
		"go_q1",
		true,  // durable
		false, // autoDelete
		false, // exlusive
		false, // noWait
		nil,   // args
	)
	if err != nil {
		panic(err)
	}

	go consume("c1", conn, queue.Name)
	go consume("c2", conn, queue.Name)

	i := 0
	for {
		err := ch.Publish(
			"", // exchange
			queue.Name,
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

func consume(consumer string, conn *amqp.Connection, q string) {
	ch, err := conn.Channel()
	if err != nil {
		panic(err)
	}
	defer ch.Close()

	msgs, err := ch.Consume(
		q,
		consumer,
		true,
		false,
		false,
		false,
		nil,
	)

	for msg := range msgs {
		fmt.Printf("%s %s\n", consumer, msg.Body)
	}
}
