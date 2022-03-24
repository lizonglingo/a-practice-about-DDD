package profile

import (
	"context"
	"coolcar/rental/profile/dao"
	"coolcar/shared/server"
	mongotesting "coolcar/shared/testing"
	"os"
	"testing"
)

func TestProfilePhotoLifecycle(t *testing.T) {


}

func newService(c context.Context, t *testing.T) *Service {
	mc, err := mongotesting.NewClient(c)
	if err != nil {
		t.Fatalf("cannot create new mongo client: %v", err)
	}

	db := mc.Database("trip")
	mongotesting.SetupIndexes(c, db)
	logger, err := server.NewZapLogger()
	if err != nil {
		t.Fatalf("cannot create logger: %v", err)
	}

	s := &Service{
		Mongo:  dao.NewMongo(db),
		Logger: logger,
	}
	return s

}

func TestMain(m *testing.M) {
	os.Exit(mongotesting.RunWithMongoInDocker(m))
}
