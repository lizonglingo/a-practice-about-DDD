package main

import (
	"context"
	"coolcar/car/amqpclt"
	carpb "coolcar/car/api/gen/v1"
	"coolcar/car/car"
	"coolcar/car/dao"
	"coolcar/car/sim"
	"coolcar/shared/server"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"log"
)

func main() {
	logger, err := server.NewZapLogger()
	if err != nil {
		log.Fatalf("cannot create logger: %v", err)
	}

	// 创建mongo client
	c := context.Background()
	mongoClient, err := mongo.Connect(c, options.Client().ApplyURI("mongodb://localhost:27017/coolcar?readPreference=primary&ssl=false"))
	if err != nil {
		logger.Fatal("cannot connect mongodb", zap.Error(err))
	}
	db := mongoClient.Database("coolcar")

	exchange := "coolcar"
	amqpConn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		logger.Fatal("cannot create amqpConn: %v", zap.Error(err))
	}
	pub, err := amqpclt.NewPublish(amqpConn, exchange)
	if err != nil {
		logger.Fatal("cannot create publisher: %v", zap.Error(err))
	}

	// Run car simulations
	// 这里要注意 万一下面的 8084 server 还没起来就连 岂不是连不上了
	// 在 simulations中添加sleep
	carConn, err := grpc.Dial("localhost:8084", grpc.WithInsecure())
	if err != nil {
		logger.Fatal("cannot create car server client: %v", zap.Error(err))
	}
	sub, err := amqpclt.NewSubscribe(amqpConn, exchange, logger)
	if err != nil {
		logger.Fatal("cannot create subscribe: %v", zap.Error(err))
	}
	simController := &sim.Controller{
		CarService: carpb.NewCarServiceClient(carConn),
		Logger: logger,
		Subscriber: sub,
	}
	go simController.RunSimulations(context.Background())
	// -------

	logger.Sugar().Fatal(server.RunGRPCServer(&server.GRPCConfig{
		Name:   "car",
		Addr:   ":8084",
		Logger: logger,
		RegisterFunc: func(s *grpc.Server) {
			carpb.RegisterCarServiceServer(s, &car.Service{
				Logger: logger,
				Mongo:  dao.NewMongo(db),
				Publisher: pub,
			})
		},
	}))
}
