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
	"math/rand"
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
	lockErr		error
}

func (m *carManager) Verify(ctx context.Context, carID id.CarID, location *rentalpb.Location) error {
	return m.verifyErr
}

func (m *carManager) Unlock(ctx context.Context, cid id.CarID, aid id.AccountID, tid id.TripID, avatarURL string) error {
	return m.unlockErr
}

func (m *carManager) Lock(ctx context.Context, cid id.CarID) error {
	return m.unlockErr
}

type distCalc struct {
}

func (d *distCalc) DistanceKm(ctx context.Context, from *rentalpb.Location, to *rentalpb.Location) (float64, error) {
	if from.Latitude == to.Latitude && from.Longitude == to.Longitude {
		return 0, nil
	}
	return 100, nil
}

func TestMain(m *testing.M) {
	os.Exit(mongotesting.RunWithMongoInDocker(m))
}

func TestService_TripLifeCycle(t *testing.T) {
	c := auth.ContextWithAccountID(context.Background(), id.AccountID("account_for_lifecycle"))
	s := newTestService(c, t, &profileManager{}, &carManager{

	})

	tid := id.TripID("6229f1a3326ea347800db42e")
	mgo.NewObjectIDWithValue(tid)
	cases := []struct {
		name    string
		now     int64
		op      func() (*rentalpb.Trip, error)
		want    string
		wantErr bool
	}{
		{
			name: "create_trip",
			now:  10000,
			op: func() (*rentalpb.Trip, error) {
				e, err := s.CreateTrip(c, &rentalpb.CreateTripRequest{
					Start: &rentalpb.Location{
						Latitude:  32,
						Longitude: 113,
					},
					CarId: "car1",
				})
				if err != nil {
					return nil, err
				}
				return e.Trip, nil
			},
			want: `{"account_id":"account_for_lifecycle","car_id":"car1","start":{"location":{"latitude":32,"longitude":113},"poi_name":"地点8","timestamp_sec":10000},"current":{"location":{"latitude":32,"longitude":113},"poi_name":"地点8","timestamp_sec":10000},"status":1}`,
		},
		{
			name: "update_trip",
			now:  20000,
			op: func() (*rentalpb.Trip, error) {
				return s.UpdateTrip(c, &rentalpb.UpdateTripRequest{
					Id: tid.String(),
					Current: &rentalpb.Location{
						Latitude:  23.421,
						Longitude: 123.32,
					},
				})
			},
			want: `{"account_id":"account_for_lifecycle","car_id":"car1","start":{"location":{"latitude":32,"longitude":113},"poi_name":"地点8","timestamp_sec":10000},"current":{"location":{"latitude":23.421,"longitude":123.32},"fee_cent":9527,"km_driven":100,"poi_name":"地点3","timestamp_sec":20000},"status":1}`,
		},
		{
			name: "finish_trip",
			now:  30000,
			op: func() (*rentalpb.Trip, error) {
				return s.UpdateTrip(c, &rentalpb.UpdateTripRequest{
					Id:      tid.String(),
					EndTrip: true,
				})
			},
			want: `{"account_id":"account_for_lifecycle","car_id":"car1","start":{"location":{"latitude":32,"longitude":113},"poi_name":"地点8","timestamp_sec":10000},"current":{"location":{"latitude":23.421,"longitude":123.32},"fee_cent":18643,"km_driven":100,"poi_name":"地点3","timestamp_sec":30000},"end":{"location":{"latitude":23.421,"longitude":123.32},"fee_cent":18643,"km_driven":100,"poi_name":"地点3","timestamp_sec":30000},"status":2}`,
		},
		{
			name: "query_trip",
			now:  40000,
			op: func() (*rentalpb.Trip, error) {
				return s.GetTrip(c, &rentalpb.GetTripRequest{Id: tid.String()})
			},
			want: `{"account_id":"account_for_lifecycle","car_id":"car1","start":{"location":{"latitude":32,"longitude":113},"poi_name":"地点8","timestamp_sec":10000},"current":{"location":{"latitude":23.421,"longitude":123.32},"fee_cent":18643,"km_driven":100,"poi_name":"地点3","timestamp_sec":30000},"end":{"location":{"latitude":23.421,"longitude":123.32},"fee_cent":18643,"km_driven":100,"poi_name":"地点3","timestamp_sec":30000},"status":2}`,
		},
		{
			name: "update_after_finished",
			now:  50000,
			op: func() (*rentalpb.Trip, error) {
				return s.UpdateTrip(c, &rentalpb.UpdateTripRequest{Id: tid.String()})
			},
			wantErr: true,
		},
	}
	rand.Seed(1234)
	for _, cc := range cases {
		nowFunc = func() int64 {
			return cc.now
		}
		trip, err := cc.op()
		if cc.wantErr {
			if err == nil {
				t.Errorf("%s: want error; got none", cc.name)
			} else {
				continue
			}
		}
		if err != nil {
			t.Errorf("%s: operating failed; %v", cc.name, err)
			continue
		}
		//if cc.name == "update_trip" || cc.name == "finish_trip" {
		//	fmt.Printf("%+v\n", trip)
		//}
		b, err := json.Marshal(trip)
		if err != nil {
			t.Errorf("%s: unmarshal failed; %v", cc.name, err)
		}
		got := string(b)
		if cc.want != got {
			t.Errorf("%s: incorrect resp; want: %s, got: %s", cc.name, cc.want, got)
		}
	}
}

// 构建测试需要的服务
func newTestService(c context.Context, t *testing.T, pm ProfileManager, cm CarManager) *Service {

	mc, err := mongotesting.NewClient(c)
	if err != nil {
		t.Fatalf("cannot create mongo client: %v", err)
	}

	logger, err := server.NewZapLogger()
	if err != nil {
		t.Fatalf("cannot create logger: %v", err)
	}

	db := mc.Database("coolcar")
	mongotesting.SetupIndexes(c, db)

	return &Service{
		ProfileManager: pm,
		CarManager:     cm,
		POIManager:     &poi.Manager{},
		Logger:         logger,
		DistanceCalc:   &distCalc{},
		Mongo:          dao.NewMongo(db),
	}
}

func TestService_CreateTrip(t *testing.T) {

	c := context.Background()

	pm := &profileManager{}
	cm := &carManager{}
	s := newTestService(c, t, pm, cm)

	req := &rentalpb.CreateTripRequest{
		Start: &rentalpb.Location{
			Latitude:  32,
			Longitude: 113,
		},
		CarId: "car1",
	}

	golden := `{"account_id":%q,"car_id":"car1","start":{"location":{"latitude":32,"longitude":113},"poi_name":"地点8","timestamp_sec":1647418825},"current":{"location":{"latitude":32,"longitude":113},"poi_name":"地点8","timestamp_sec":1647418825},"status":1,"identity_id":"identity1"}`

	pm.iID = "identity1"

	cases := []struct {
		name         string
		accountID    string
		tripID       string
		profileErr   error
		carVerifyErr error
		carUnlockErr error
		want         string
		wantErr      bool
	}{
		{
			name:      "normal_create",
			accountID: "account1",
			tripID:    "6229f1a1326ea347800db41e",
			want:      fmt.Sprintf(golden, "account1"),
		},
		{
			name:       "profile_err",
			accountID:  "account2",
			tripID:     "6229f1a1326ea347800db42e",
			profileErr: fmt.Errorf("profile err"),
			wantErr:    true,
		},
		{
			name:         "carVerify_err",
			accountID:    "account3",
			tripID:       "6229f1a1326ea347800db43e",
			carVerifyErr: fmt.Errorf("car verify err"),
			wantErr:      true,
		},
		{
			name:         "carUnlock_err",
			accountID:    "account4",
			tripID:       "6229f1a1326ea347800db44e",
			carUnlockErr: fmt.Errorf("car unlock err"),
			want:         fmt.Sprintf(golden, "account4"),
			// wantErr:    false, // 希望是成功的 因为逻辑代码中不希望他有错
		},
	}

	for _, cc := range cases {
		t.Run(cc.name, func(t *testing.T) {
			mgo.NewObjectIDWithValue(id.TripID(cc.tripID))
			nowFunc = func() int64 {
				return 1647418825
			}
			pm.err = cc.profileErr
			cm.unlockErr = cc.carUnlockErr
			cm.verifyErr = cc.carVerifyErr
			c := auth.ContextWithAccountID(context.Background(), id.AccountID(cc.accountID))
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
