package trip

import (
	"context"
	rentalpb "coolcar/rental/api/gen/v1"
	"coolcar/rental/trip/client/poi"
	"coolcar/rental/trip/dao"
	"coolcar/shared/auth"
	"coolcar/shared/id"
	mgo "coolcar/shared/mongo"
	"coolcar/shared/server"
	mongotesting "coolcar/shared/testing"
	"encoding/json"
	"fmt"
	"os"
	"testing"
)

// profileManager 测试用例.
type profileManager struct {
	iID id.IdentityID
	err error
}

func (p *profileManager) Verify(ctx context.Context, id id.AccountID) (id.IdentityID, error) {
	return p.iID, p.err
}

type carManager struct {
	verifyErr error
	unlockErr error
}

func (c *carManager) Verify(ctx context.Context, carID id.CarID, location *rentalpb.Location) error {
	return c.verifyErr
}

func (c *carManager) Unlock(ctx context.Context, carID id.CarID) error {
	return c.unlockErr
}

func TestMain(m *testing.M) {
	os.Exit(mongotesting.RunWithMongoInDocker(m))
}

func TestService_CreateTrip(t *testing.T) {
	c := auth.ContextWithAccountID(context.Background(), id.AccountID("account1"))
	mongoClient, err := mongotesting.NewClient(c)
	if err != nil {
		t.Fatalf("cannot create mongo client: %v", err)
	}

	pm := &profileManager{
		iID: "",
		err: nil,
	}
	cm := &carManager{
		verifyErr: nil,
		unlockErr: nil,
	}
	logger, err := server.NewZapLogger()
	if err != nil {
		t.Fatalf("cannot create logger: %v", err)
	}

	s := &Service{
		ProfileManager: pm,
		CarManager:     cm,
		POIManager:     &poi.Manager{},
		Logger:         logger,
		Mongo:          dao.NewMongo(mongoClient.Database("coolcar")),
	}

	req := &rentalpb.CreateTripRequest{
		Start: &rentalpb.Location{
			Latitude:  32,
			Longitude: 113,
		},
		CarId: "car1",
	}

	golden := `{"account_id":"account1","car_id":"car1","start":{"location":{"latitude":32,"longitude":113},"poi_name":"地点8"},"current":{"location":{"latitude":32,"longitude":113},"poi_name":"地点8"},"status":1,"identity_id":"identity1"}`

	pm.iID = "identity1"

	cases := []struct {
		name         string
		tripID       string
		profileErr   error
		carVerifyErr error
		carUnlockErr error
		want         string
		wantErr      bool
	}{
		{
			name:   "normal_create",
			tripID: "6229f1a1326ea347800db41e",
			want:   golden,
		},
		{
			name:       "profile_err",
			tripID:     "6229f1a1326ea347800db42e",
			profileErr: fmt.Errorf("profile err"),
			wantErr:    true,
		},
		{
			name:         "carVerify_err",
			tripID:       "6229f1a1326ea347800db43e",
			carVerifyErr: fmt.Errorf("car verify err"),
			wantErr:      true,
		},
		{
			name:         "carUnlock_err",
			tripID:       "6229f1a1326ea347800db44e",
			carUnlockErr: fmt.Errorf("car unlock err"),
			want:         golden,
			// wantErr:    false, // 希望是成功的 因为逻辑代码中不希望他有错
		},
	}

	for _, cc := range cases {
		t.Run(cc.name, func(t *testing.T) {
			mgo.NewObjectIDWithValue(id.TripID(cc.tripID))
			pm.err = cc.profileErr
			cm.unlockErr = cc.carUnlockErr
			cm.verifyErr = cc.carVerifyErr
			res, err := s.CreateTrip(c, req)
			if cc.wantErr {
				if err == nil {
					t.Errorf("want error; got none")
				} else {
					return
				}
			}
			if err != nil {
				t.Errorf("cannot creating trip: %v", err)
				return
			}
			if res.Id != cc.tripID {
				t.Errorf("incorrect id; want %q ,got %q", cc.tripID, res.Id)
			}
			bytes, err := json.Marshal(res.Trip)
			if err != nil {
				t.Errorf("cannot marshal response %v", err)
			}
			tripString := string(bytes)
			if cc.want != tripString {
				t.Errorf("incorrect response: want %s, got %s", cc.want, tripString)
			}
		})
	}
}
