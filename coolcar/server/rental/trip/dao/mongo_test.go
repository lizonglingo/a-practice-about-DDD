package dao

import (
	"context"
	rentalpb "coolcar/rental/api/gen/v1"
	"coolcar/shared/id"
	"coolcar/shared/mongo/objid"
	mongotesting "coolcar/shared/testing"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
	"testing"
)

var mongoURI string

func TestMain(m *testing.M) {
	os.Exit(mongotesting.RunWithMongoInDocker(m, &mongoURI))
}

func TestMongo_CreateTrip(t *testing.T) {
	mongoURI = "mongodb://localhost:27017"
	c := context.Background()
	mc, err := mongo.Connect(c, options.Client().ApplyURI(mongoURI))
	if err != nil {
		t.Fatalf("cannot connect mongodb: %v\n", err)
	}

	// 初始化数据库
	m := NewMongo(mc.Database("coolcar"))
	acct := id.AccountID("account1")
	tripRecord, err := m.CreateTrip(c, &rentalpb.Trip{
		AccountId: acct.String(),
		CarId:     "car1",
		Start: &rentalpb.LocationStatus{
			Location: &rentalpb.Location{
				Latitude:  30,
				Longitude: 120,
			},
			FeeCent:  0,
			KmDriven: 0,
			PoiName:  "startPoint",
		},
		Current: nil,
		End: &rentalpb.LocationStatus{
			Location: &rentalpb.Location{
				Latitude:  35,
				Longitude: 115,
			},
			FeeCent:  10000,
			KmDriven: 35,
			PoiName:  "endPoint",
		},
		Status: rentalpb.TripStatus_FINISHED,
	})

	if err != nil {
		t.Errorf("cannot create trip: %v\n", err)
	}
	t.Errorf("inserted row %s with updatedat %v\n", tripRecord.ID, tripRecord.UpdatedAt)

	getTrip, err := m.GetTrip(c, objid.ToTripID(tripRecord.ID), acct)
	if err != nil {
		t.Errorf("cannot got trip: %v\n", err)
	}
	t.Errorf("got trip: %+v", getTrip)
}
