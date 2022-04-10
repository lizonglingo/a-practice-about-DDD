package main

import (
	"context"
	carpb "coolcar/car/api/gen/v1"
	"coolcar/car/car"
	"coolcar/car/dao"
	"coolcar/car/mq/amqpclt"
	"coolcar/car/sim"
	"coolcar/car/sim/pos"
	"coolcar/car/trip"
	"coolcar/car/ws"
	rentalpb "coolcar/rental/api/gen/v1"
	coolenvpb "coolcar/shared/coolenv"
	"coolcar/shared/server"
	"github.com/gorilla/websocket"
	"github.com/namsral/flag"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"log"
	"net/http"
)

var addr = flag.String("addr", ":8084", "address of car service to listen")
var wsAddr = flag.String("ws_addr", ":9090", "address of web socket")
var mongoURI = flag.String("mongo_uri", "mongodb://localhost:27017/coolcar?readPreference=primary&ssl=false", "mongouri")
var amqpURL = flag.String("amqp_url", "amqp://guest:guest@localhost:5672/", "address of amqp")
var carAddr = flag.String("car_addr", "localhost:8084", "address of car service to listen, use for car simulation to connect to car service")
var tripAddr = flag.String("trip_addr", "localhost:8082", "address of trip service")
var aiAddr = flag.String("ai_addr", "localhost:18001", "address of ai service")

func main() {

	flag.Parse()

	logger, err := server.NewZapLogger()
	if err != nil {
		log.Fatalf("cannot create logger: %v", err)
	}

	// 创建mongo client
	c := context.Background()
	// mongoClient, err := mongo.Connect(c, options.Client().ApplyURI("mongodb://localhost:27017/coolcar?readPreference=primary&ssl=false"))
	mongoClient, err := mongo.Connect(c, options.Client().ApplyURI(*mongoURI))

	if err != nil {
		logger.Fatal("cannot connect mongodb", zap.Error(err))
	}
	db := mongoClient.Database("coolcar")

	exchange := "coolcar"
	// amqpConn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	amqpConn, err := amqp.Dial(*amqpURL)
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
	// carConn, err := grpc.Dial("localhost:8084", grpc.WithInsecure())
	carConn, err := grpc.Dial(*carAddr, grpc.WithInsecure())
	if err != nil {
		logger.Fatal("cannot create car server client: %v", zap.Error(err))
	}
	// aiConn, err := grpc.Dial("localhost:18001", grpc.WithInsecure())
	aiConn, err := grpc.Dial(*aiAddr, grpc.WithInsecure())
	if err != nil {
		logger.Fatal("cannot connect to ai service: %v", zap.Error(err))
	}
	sub, err := amqpclt.NewSubscriber(amqpConn, exchange, logger)
	if err != nil {
		logger.Fatal("cannot create car subscribe: %v", zap.Error(err))
	}
	posSub, err := amqpclt.NewSubscriber(amqpConn, "pos_sim", logger)
	if err != nil {
		logger.Fatal("cannot create pos subscribe: %v", zap.Error(err))
	}
	simController := &sim.Controller{
		CarService:    carpb.NewCarServiceClient(carConn),
		AIService:     coolenvpb.NewAIServiceClient(aiConn),
		Logger:        logger,
		CarSubscriber: sub,
		PosSubscriber: &pos.Subscriber{
			Sub:    posSub,
			Logger: logger,
		},
	}
	go simController.RunSimulations(context.Background())

	// ------- start websocket
	u := &websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	http.HandleFunc("/ws", ws.Handler(u, sub, logger))
	go func() {
		// addr := ":9090"
		addr := *wsAddr
		logger.Info("websocket HTTP handler started.", zap.String("addr", addr))
		logger.Sugar().Fatal(http.ListenAndServe(addr, nil))
	}()

	// Start trip updater
	// tripConn, err := grpc.Dial("localhost:8082", grpc.WithInsecure())
	tripConn, err := grpc.Dial(*tripAddr, grpc.WithInsecure())
	if err != nil {
		logger.Fatal("cannot create trip service client: %v", zap.Error(err))
	}
	go trip.RunUpdater(sub, rentalpb.NewTripServiceClient(tripConn), logger)

	logger.Sugar().Fatal(server.RunGRPCServer(&server.GRPCConfig{
		Name: "car",
		// Addr:   ":8084",
		Addr:   *addr,
		Logger: logger,
		RegisterFunc: func(s *grpc.Server) {
			carpb.RegisterCarServiceServer(s, &car.Service{
				Logger:    logger,
				Mongo:     dao.NewMongo(db),
				Publisher: pub,
			})
		},
	}))
}
