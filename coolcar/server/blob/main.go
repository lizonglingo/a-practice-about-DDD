package main

import (
	"context"
	blobpb "coolcar/blob/api/gen/v1"
	"coolcar/blob/blob"
	"coolcar/blob/dao"
	aliyun_oos "coolcar/blob/oos"
	"coolcar/shared/server"
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

	c := context.Background()
	mongoClient, err := mongo.Connect(c, options.Client().ApplyURI("mongodb://localhost:27017/coolcar?readPreference=primary&ssl=false"))
	if err != nil {
		logger.Fatal("cannot connect mongodb", zap.Error(err))
	}
	db := mongoClient.Database("coolcar")
	// 使用cos
	//storage, err := cos.NewService(
	//	"https://coolcar-1258527714.cos.ap-chengdu.myqcloud.com",
	//	"AKIDkJdhX7SXNyJPJyNWQ5UdXBajdHgpjQt7",
	//	"nMglaAVaPzJODn7C2cx3tTotjJdiY8SW")

	// 使用 oss
	storage, err := aliyun_oos.NewService(
		"oss-cn-beijing.aliyuncs.com",
		"LTAI5tMHJ7sDiyySLtCsE8bq",
		"B5Q3tcfRUDnmciH7vPhY54CHI5a67V",
		"coolcar-lzl")
	if err != nil {
		log.Fatal("cannot create cos service", zap.Error(err))
	}

	logger.Sugar().Fatal(server.RunGRPCServer(&server.GRPCConfig{
		Name:   "blob",
		Addr:   ":8083",
		Logger: logger,
		RegisterFunc: func(s *grpc.Server) {
			blobpb.RegisterBlobServiceServer(s, &blob.Service{
				Storage: storage,
				Mongo:  dao.NewMongo(db),
				Logger: logger,
			})
		},
	}))
}
