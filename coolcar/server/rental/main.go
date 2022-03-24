package main

import (
	"context"
	blobpb "coolcar/blob/api/gen/v1"
	"coolcar/rental/ai"
	rentalpb "coolcar/rental/api/gen/v1"
	"coolcar/rental/profile"
	profiledao "coolcar/rental/profile/dao"
	"coolcar/rental/trip"
	"coolcar/rental/trip/client/car"
	"coolcar/rental/trip/client/poi"
	profClient "coolcar/rental/trip/client/profile"
	tripdao "coolcar/rental/trip/dao"
	coolenvpb "coolcar/shared/coolenv"
	"coolcar/shared/server"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"log"
	"time"
)

func main() {
	// 创建 logger
	logger, err := server.NewZapLogger()
	if err != nil {
		log.Fatalf("cannot create logger: %v\n", err)
	}

	// 创建 AIClient
	ac, err := grpc.Dial("localhost:18001", grpc.WithInsecure())
	if err != nil {
		log.Fatal("cannot connect to aiservice", zap.Error(err))
	}

	// 创建mongo client
	c := context.Background()
	mongoClient, err := mongo.Connect(c, options.Client().ApplyURI("mongodb://localhost:27017/coolcar?readPreference=primary&ssl=false"))
	if err != nil {
		logger.Fatal("cannot connect mongodb", zap.Error(err))
	}

	db := mongoClient.Database("coolcar")

	blobConn, err := grpc.Dial("localhost:8083", grpc.WithInsecure())
	if err != nil {
		logger.Fatal("cannot connect blob service", zap.Error(err))
	}

	profileService := &profile.Service{
		BlobClient:        blobpb.NewBlobServiceClient(blobConn),
		PhotoGetExpire:    5 * time.Second,
		PhotoUploadExpire: 10 * time.Second,
		Mongo:             profiledao.NewMongo(db),
		Logger:            logger,
	}

	logger.Sugar().Fatal(server.RunGRPCServer(&server.GRPCConfig{
		Name:              "rental",
		Addr:              ":8082",
		AuthPublicKeyFile: "../shared/auth/public.key",
		Logger:            logger,
		RegisterFunc: func(s *grpc.Server) {
			rentalpb.RegisterTripServiceServer(s, &trip.Service{
				ProfileManager: &profClient.Manager{
					Fetcher: profileService,
				},
				CarManager: &car.Manager{},
				POIManager: &poi.Manager{},
				Mongo:      tripdao.NewMongo(db),
				DistanceCalc: &ai.Client{
					AIClient: coolenvpb.NewAIServiceClient(ac),
				},
				Logger: logger,
			})
			rentalpb.RegisterProfileServiceServer(s, profileService)
		},
	}))
}
