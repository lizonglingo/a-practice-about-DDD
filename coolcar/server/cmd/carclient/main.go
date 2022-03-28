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

	// create some cars
	//for i:=0;i<5;i++ {
	//	car, err := carServiceClient.CreateCar(ctx, &carpb.CreateCarRequest{})
	//	if err != nil {
	//		panic(err)
	//	}
	//	fmt.Printf("created car: %s", car.Id)
	//}

	// reset all cars
	res, err := carServiceClient.GetCats(ctx, &carpb.GetCarsRequest{})
	if err != nil {
		panic(err)
	}
	for _, car := range res.Cars {
		_, err := carServiceClient.UpdateCar(ctx, &carpb.UpdateCarRequest{
			Id:       car.Id,
			Status:   carpb.CarStatus_LOCKED,
		})
		if err != nil {
			fmt.Printf("cannot reset car %q: %v", car.Id, err)
		}
	}
	fmt.Printf("%d cars are reset.", len(res.Cars))
}
