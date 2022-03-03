package main

import (
	"context"
	trippb "coolcar/proto/gen/go"
	trip "coolcar/tripservice"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/encoding/protojson"
	"log"
	"net"
	"net/http"
)

func main() {
	log.SetFlags(log.Lshortfile)
	go startGRPCGateway()
	// set TCP listener
	listener, err := net.Listen("tcp", ":8081")
	if err != nil {
		log.Printf("failed to listen: %v\n", err)
	}

	// create grpc Server and register
	s := grpc.NewServer()
	trippb.RegisterTripServiceServer(s, &trip.Service{})
	log.Fatal(s.Serve(listener))
}

// startGRPCGateway 建立 gRPC Gateway 与 gRPC 服务 GetTrip 的连接.
func startGRPCGateway()  {
	c := context.Background()
	c, cancel := context.WithCancel(c)
	defer cancel()	// 在请求结束后断开连接

	mux := runtime.NewServeMux(runtime.WithMarshalerOption(
		runtime.MIMEWildcard, &runtime.JSONPb{
			MarshalOptions:   protojson.MarshalOptions{UseEnumNumbers: true, UseProtoNames: true},	// 将枚举转化成数字 将命名改成驼峰
			UnmarshalOptions: protojson.UnmarshalOptions{DiscardUnknown: true},	// 用来忽略proto中不存在的字段，因为小程序可能发送这样的字段
		},
		))
	err := trippb.RegisterTripServiceHandlerFromEndpoint(
		c,
		mux,	// 将api注册到该多路复用器上，以便http调用时触发此多路复用器
		"localhost:8081",	// 内部gRPC服务的地址
		[]grpc.DialOption{grpc.WithInsecure()},
		)
	if err != nil {
		log.Fatal("cannot start grpc gateway: %v", err)
	}

	err = http.ListenAndServe(":8123", mux)	// 需要使用网关的地址 和 handler
	if err != nil {
		log.Fatal("cannot listen and server: %v\n", err)
	}
}