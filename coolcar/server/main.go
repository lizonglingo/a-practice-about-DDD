package main

import (
	trippb "coolcar/proto/gen/go"
	trip "coolcar/tripservice"

	"google.golang.org/grpc"
	"log"
	"net"
)

func main() {
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
