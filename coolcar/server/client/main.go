package main

import (
	"context"
	trippb "coolcar/proto/gen/go"
	"fmt"
	"google.golang.org/grpc"
	"log"
)

func main() {
	log.SetFlags(log.Lshortfile)
	conn, err := grpc.Dial("localhost:8081", grpc.WithInsecure())
	if err != nil {
		log.Fatal("cannot connect to server: %v\n", err)
	}

	tripServiceClient := trippb.NewTripServiceClient(conn)
	trip, err := tripServiceClient.GetTrip(context.Background(), &trippb.GetTripRequest{
		Id: "trip_testing",
	})
	if err != nil {
		log.Fatal("cannot get trip: %v/n", err)
	}

	fmt.Println(trip)
}
