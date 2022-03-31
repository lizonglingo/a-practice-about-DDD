package main

import (
	"context"
	"coolcar/car/mq/amqpclt"
	coolenvpb "coolcar/shared/coolenv"
	"coolcar/shared/server"
	"encoding/json"
	"fmt"
	"github.com/streadway/amqp"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"log"
	"time"
)

func main() {
	conn, err := grpc.Dial("localhost:18001", grpc.WithInsecure())
	if err != nil {
		panic(err)
	}


	ac := coolenvpb.NewAIServiceClient(conn)
	c := context.Background()
	res, err := ac.MeasureDistance(c, &coolenvpb.MeasureDistanceRequest{
		From: &coolenvpb.Location{
			Latitude:  30,
			Longitude: 120,
		},
		To:   &coolenvpb.Location{
			Latitude:  31,
			Longitude: 121,
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Printf("%+v\n", res)

	// 模拟汽车移动

	logger, err := server.NewZapLogger()
	if err != nil {
		log.Fatalf("cannot create logger: %v", err)
	}
	amqpConn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		logger.Fatal("cannot create amqpConn: %v", zap.Error(err))
	}

	_, err = ac.SimulateCarPos(c, &coolenvpb.SimulateCarPosRequest{
		CarId:      "car123",
		Type:       coolenvpb.PosType_NINGBO,
		InitialPos: &coolenvpb.Location{
			Latitude:  30,
			Longitude: 120,
		},
	})
	if err != nil {
		panic(err)
	}

	// 将汽车信息发给 MQ
	sub, err := amqpclt.NewSubscriber(amqpConn, "pos_sim", logger)
	if err != nil {
		panic(err)
	}

	ch, cleanUp, err := sub.SubscribeRaw(c)
	defer cleanUp()
	if err != nil {
		panic(err)
	}

	endTime := time.After(10 * time.Second)
	for {
		shouldStop := false
		select {
		case <-endTime:
			shouldStop = true
			break
		case msg := <- ch:
			var update coolenvpb.CarPosUpdate
			err = json.Unmarshal(msg.Body, &update)
			if err != nil {
				panic(err)
			}
			fmt.Printf("%+v\n", &update)
		}
		if shouldStop {
			break
		}
	}

	// 传入结束位置信息
	_, err = ac.EndSimulateCarPos(c, &coolenvpb.EndSimulateCarPosRequest{CarId: "car123"})
	if err != nil {
		panic(err)
	}
}
