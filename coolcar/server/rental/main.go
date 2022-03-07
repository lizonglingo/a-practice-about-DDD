package main

import (
	rentalpb "coolcar/rental/api/gen/v1"
	"coolcar/rental/trip"
	"coolcar/shared/auth"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"log"
	"net"
)

func main() {
	logger, err := newZapLogger()
	if err != nil {
		log.Fatalf("cannot create logger: %v\n", err)
	}

	listener, err := net.Listen("tcp", ":8082")
	if err != nil {
		logger.Fatal("cannot listen", zap.Error(err))
	}

	in, err := auth.Interceptor("../shared/auth/public.key")
	if err != nil {
		logger.Fatal("cannot create auth interceptor", zap.Error(err))
	}

	// 在初始化gRPC服务时需要为该gRPC服务设置拦截器
	s := grpc.NewServer(grpc.UnaryInterceptor(in))
	rentalpb.RegisterTripServiceServer(s, &trip.Service{
		Logger: logger,
	})

	err = s.Serve(listener)
	logger.Fatal("cannot server", zap.Error(err))
}

func newZapLogger() (*zap.Logger, error) {
	cfg := zap.NewDevelopmentConfig()
	cfg.EncoderConfig.TimeKey = ""
	return cfg.Build()
}
