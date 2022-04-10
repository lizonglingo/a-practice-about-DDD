package main

import (
	"context"
	blobpb "coolcar/blob/api/gen/v1"
	carpb "coolcar/car/api/gen/v1"
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
	"github.com/namsral/flag"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"log"
	"time"
)

var addr = flag.String("addr", ":8082", "address of rental service, include trip and profile")
var mongoURI = flag.String("mongo_uri", "mongodb://localhost:27017/coolcar?readPreference=primary&ssl=false", "mongouri")
var aiAddr = flag.String("ai_addr", "localhost:18001", "address of ai service")
var blobAddr = flag.String("blob_addr", "localhost:8083", "address of blob service")
var carAddr = flag.String("car_addr", "localhost:8084", "address of car service")
var authPublicKeyFile = flag.String("auth_public_key_file", "../shared/auth/public.key", "public key file for verify JWT token signature")

func main() {

	flag.Parse()

	// 创建 logger
	logger, err := server.NewZapLogger()
	if err != nil {
		log.Fatalf("cannot create logger: %v\n", err)
	}

	// 创建 AIClient
	// ac, err := grpc.Dial("localhost:18001", grpc.WithInsecure())
	ac, err := grpc.Dial(*aiAddr, grpc.WithInsecure())
	if err != nil {
		log.Fatal("cannot connect to aiservice", zap.Error(err))
	}

	// 创建mongo client
	c := context.Background()
	// mongoClient, err := mongo.Connect(c, options.Client().ApplyURI("mongodb://localhost:27017/coolcar?readPreference=primary&ssl=false"))
	mongoClient, err := mongo.Connect(c, options.Client().ApplyURI(*mongoURI))

	if err != nil {
		logger.Fatal("cannot connect mongodb", zap.Error(err))
	}

	db := mongoClient.Database("coolcar")

	// blobConn, err := grpc.Dial("localhost:8083", grpc.WithInsecure())
	blobConn, err := grpc.Dial(*blobAddr, grpc.WithInsecure())
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

	// carConn, err := grpc.Dial("localhost:8084", grpc.WithInsecure())
	carConn, err := grpc.Dial(*carAddr, grpc.WithInsecure())
	if err != nil {
		logger.Fatal("cannot connect car service", zap.Error(err))
	}

	logger.Sugar().Fatal(server.RunGRPCServer(&server.GRPCConfig{
		Name:              "rental",
		// Addr:              ":8082",
		Addr:              *addr,
		// AuthPublicKeyFile: "../shared/auth/public.key",
		AuthPublicKeyFile: *authPublicKeyFile,
		Logger:            logger,
		RegisterFunc: func(s *grpc.Server) {
			rentalpb.RegisterTripServiceServer(s, &trip.Service{
				ProfileManager: &profClient.Manager{
					Fetcher: profileService,
				},
				CarManager: &car.Manager{
					CarService: carpb.NewCarServiceClient(carConn),
				},
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
