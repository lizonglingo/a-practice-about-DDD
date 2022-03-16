package server

import (
	"coolcar/shared/auth"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"net"
)

type GRPCConfig struct {
	Name              string
	Addr              string
	AuthPublicKeyFile string
	RegisterFunc      func(*grpc.Server)
	Logger            *zap.Logger
}

// RunGRPCServer 将gRPC服务启动部分抽取成公用函数.
func RunGRPCServer(c *GRPCConfig) error {
	nameField := zap.String("name", c.Name)

	listener, err := net.Listen("tcp", c.Addr)
	if err != nil {
		c.Logger.Fatal("cannot listen", nameField, zap.Error(err))
	}

	var gRPCOpts []grpc.ServerOption
	if c.AuthPublicKeyFile != "" {		// 说明此时需要添加拦截器 引入鉴权中间件
		in, err := auth.Interceptor(c.AuthPublicKeyFile)
		if err != nil {
			c.Logger.Fatal("cannot create auth interceptor", nameField, zap.Error(err))
		}
		gRPCOpts = append(gRPCOpts, grpc.UnaryInterceptor(in))
	}

	// 在初始化gRPC服务时需要为该gRPC服务设置拦截器
	s := grpc.NewServer(gRPCOpts...)
	c.RegisterFunc(s)

	c.Logger.Info("server started", nameField, zap.String("addr", c.Addr))
	return s.Serve(listener)
}
