package main

import (
	"context"
	authpb "coolcar/auth/api/gen/v1"
	carpb "coolcar/car/api/gen/v1"
	rentalpb "coolcar/rental/api/gen/v1"
	"coolcar/shared/auth"
	"coolcar/shared/server"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/namsral/flag"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/encoding/protojson"
	"log"
	"net/http"
	"net/textproto"
)

var addr = flag.String("addr", ":8123", "address of gateway service to listen")
var authAddr = flag.String("auth_addr", "localhost:8081", "address of auth service")
var tripAddr = flag.String("trip_addr", "localhost:8082", "address of trip service")
var profileAddr = flag.String("profile_addr", "localhost:8082", "address of profile service")
var carAddr = flag.String("car_addr", "localhost:8084", "address of car service")

func main() {
	// 解析从命令行中来的参数
	flag.Parse()

	logger, err := server.NewZapLogger()
	if err != nil {
		log.Fatalf("cannot create zap logger %v\n", err)
	}

	c := context.Background()
	c, cancel := context.WithCancel(c)
	defer cancel()

	// 为网关对外访问的 RESTful API 生成 mux 接受请求
	mux := runtime.NewServeMux(runtime.WithMarshalerOption(
		runtime.MIMEWildcard, &runtime.JSONPb{
			MarshalOptions: protojson.MarshalOptions{UseEnumNumbers: true, UseProtoNames: true},
			// UnmarshalOptions: protojson.UnmarshalOptions{},
		}), runtime.WithIncomingHeaderMatcher(func(key string) (string, bool) {
			// logger.Debug("checking key", zap.String("key", key))
			if key == textproto.CanonicalMIMEHeaderKey(runtime.MetadataPrefix + auth.ImpersonateAccountHeader) {
				return "", false
			}
			return runtime.DefaultHeaderMatcher(key)
	}))

	serverConfig := []struct {
		name         string
		addr         string
		registerFunc func(ctx context.Context, mux *runtime.ServeMux, endpoint string, opts []grpc.DialOption) (err error)
	}{
		{
			name:         "auth",
			addr:         *authAddr,
			registerFunc: authpb.RegisterAuthServiceHandlerFromEndpoint,
		},
		{
			name:         "trip",
			addr:         *tripAddr,
			registerFunc: rentalpb.RegisterTripServiceHandlerFromEndpoint,
		},
		{
			name:         "profile",
			addr:         *profileAddr,
			registerFunc: rentalpb.RegisterProfileServiceHandlerFromEndpoint,
		},
		{
			name:         "car",
			addr:         *carAddr,
			registerFunc: carpb.RegisterCarServiceHandlerFromEndpoint,
		},
	}

	for _, s := range serverConfig {
		err := s.registerFunc(c, mux, s.addr, []grpc.DialOption{grpc.WithInsecure()})
		if err != nil {
			logger.Sugar().Fatalf("cannot register %s service: %v\n", s.name, err)
		}
	}

	// 抽取配置
	// addr := ":8123"

	logger.Sugar().Infof("grpc gateway started at %s\n", *addr)
	logger.Sugar().Fatal(http.ListenAndServe(*addr, mux))
}
