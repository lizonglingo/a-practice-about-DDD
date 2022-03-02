package trip

import (
	"context"
	trippb "coolcar/proto/gen/go"
)

type Service struct {
	trippb.UnimplementedTripServiceServer
}

func (*Service) GetTrip(ctx context.Context, request *trippb.GetTripRequest) (*trippb.GetTripResponse, error) {
	return &trippb.GetTripResponse{
		Id: request.Id,
		Trip: &trippb.Trip{
			Start:         "北京",
			StartPos:      &trippb.Location{
				Latitude: 12,
				Longitude: 30,
			},
			PathLocations: []*trippb.Location{
				{
					Latitude: 11,
					Longitude: 22,
				},
			},
			End:           "南京",
			EndPos:        &trippb.Location{
				Latitude: 15,
				Longitude: 35,
			},
			DurationSec:   3600,
			FeeCent:       10000,
			Status:        trippb.TripStatus_IN_PROGRESS,
		},
	}, nil
}

//func (*Service) mustEmbedUnimplementedTripServiceServer() {
//	log.Printf("In mustEmbedUnimplementedTripServiceServer\n")
//}

