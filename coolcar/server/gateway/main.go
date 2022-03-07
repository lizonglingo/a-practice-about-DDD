package main

import (
	"context"
	authpb "coolcar/auth/api/gen/v1"
	rentalpb "coolcar/rental/api/gen/v1"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/encoding/protojson"
	"log"
	"net/http"
)

func main() {
	c := context.Background()
	c, cancel := context.WithCancel(c)
	defer cancel()

	// 为网关对外访问的 RESTful API 生成 mux 接受请求
	mux := runtime.NewServeMux(runtime.WithMarshalerOption(
		runtime.MIMEWildcard, &runtime.JSONPb{
			MarshalOptions: protojson.MarshalOptions{UseEnumNumbers: true, UseProtoNames: true},
			// UnmarshalOptions: protojson.UnmarshalOptions{},
		}))

	// 将auth-Login gRPC服务注册到网关上，连接mux以接收请求
	err := authpb.RegisterAuthServiceHandlerFromEndpoint(c, mux, "localhost:8081",
		[]grpc.DialOption{grpc.WithInsecure()})
	if err != nil {
		log.Fatalf("cannot register auth service: %v\n", err)
	}

	// 将rental-Trip gRPC服务注册到网关上，连接mux以接收请求
	err = rentalpb.RegisterTripServiceHandlerFromEndpoint(c, mux, "localhost:8082",
		[]grpc.DialOption{grpc.WithInsecure()})
	if err != nil {
		log.Fatalf("cannot register rental service: %v\n", err)
	}

	log.Fatal(http.ListenAndServe(":8123", mux))
}
