package main

import (
	"context"
	carpb "coolcar/car/api/gen/v1"
	"fmt"
	"google.golang.org/grpc"
)

func main() {
	conn, err := grpc.Dial("localhost:8084", grpc.WithInsecure())
	if err != nil {
		panic(err)
	}

	ctx := context.Background()

	carServiceClient := carpb.NewCarServiceClient(conn)
	for i:=0;i<5;i++ {
		car, err := carServiceClient.CreateCar(ctx, &carpb.CreateCarRequest{})
		if err != nil {
			panic(err)
		}
		fmt.Printf("created car: %s", car.Id)
	}

}
