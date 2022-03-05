package dao

import (
	"context"
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

func TestMongo_ResolveAccountID(t *testing.T) {
	c := context.Background()
	mc, err := mongo.Connect(c, options.Client().ApplyURI(mongoURI))
	if err != nil {
		t.Fatalf("cannot connect mongodb: %v\n", err)
	}

	m := NewMongo(mc.Database("coolcar"))
	id, err := m.ResolveAccountID(c, "123")
	if err != nil {
		t.Errorf("fail resolve account id for 123: %v", err)
	} else {
		want := "6223554ecd96314f99e7e088"
		if id != want {
			t.Errorf("resolve account id: want: %q, got: %q\n", want, id)
		}
	}

}
