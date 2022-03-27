package dao

import (
	"context"
	carpb "coolcar/car/api/gen/v1"
	"coolcar/shared/id"
	mgo "coolcar/shared/mongo"
	"coolcar/shared/mongo/objid"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	carField      = "car"
	statusField   = carField + ".status"
	driverField   = carField + ".driver"
	positionField = carField + ".position"
	tripIDField   = carField + ".tripid"
)

type CarRecord struct {
	mgo.IDField `bson:"inline"`
	Car         *carpb.Car `bson:"car"`
}

type Mongo struct {
	col *mongo.Collection // mongo 中的表结构
}

// NewMongo 根据给出的数据库，从中获取操作的 trip 表.
func NewMongo(db *mongo.Database) *Mongo {
	return &Mongo{
		col: db.Collection("car"),
	}
}

func (m *Mongo) CreateCar(ctx context.Context) (*CarRecord, error) {
	r := &CarRecord{
		Car: &carpb.Car{
			Status: carpb.CarStatus_LOCKED,
			Position: &carpb.Location{
				Latitude:  30,
				Longitude: 120,
			},
		},
	}
	r.ID = mgo.NewObjID()
	_, err := m.col.InsertOne(ctx, r)
	if err != nil {
		return nil, err
	}
	return r, err
}

func (m *Mongo) GetCar(ctx context.Context, id id.CarID) (*CarRecord, error) {
	objID, err := objid.FromID(id)
	if err != nil {
		return nil, fmt.Errorf("invaild id: %v", err)
	}

	res := m.col.FindOne(ctx, bson.M{
		mgo.IDFieldName: objID,
	})
	return covertSingResult(res)
}

func (m *Mongo) GetCars(ctx context.Context) ([]*CarRecord, error) {
	// 暂时全部选出来
	filter := bson.M{}
	res, err := m.col.Find(ctx, filter, options.Find())
	if err != nil {
		return nil, err
	}

	var carRecodes []*CarRecord
	for res.Next(ctx) {
		var car CarRecord
		err := res.Decode(&car)
		if err != nil {
			return nil, err
		}
		carRecodes = append(carRecodes, &car)
	}
	return carRecodes, nil
}

type CarUpdate struct {
	Status       carpb.CarStatus
	Position     *carpb.Location
	Driver       *carpb.Driver
	UpdateTripID bool
	TripID       id.TripID
}

// UpdateCar 这里的status用来做更新car的前置条件.
func (m *Mongo) UpdateCar(ctx context.Context, id id.CarID, status carpb.CarStatus, update *CarUpdate) (*CarRecord, error) {
	objID, err := objid.FromID(id)
	if err != nil {
		return nil, fmt.Errorf("invaild car id: %v", err)
	}

	// 判断以下是 只用 id 来定位哪条记录 还是使用 id+status 来找
	// 在没有指定状态时 就只用 id 来找
	filter := bson.M{
		mgo.IDFieldName: objID,
	}
	if status != carpb.CarStatus_CS_NOT_SPECIFIED {
		filter[statusField] = status
	}

	// 设置更新内容
	u := bson.M{}
	if update.Status != carpb.CarStatus_CS_NOT_SPECIFIED {
		u[statusField] = update.Status
	}
	if update.Driver != nil {
		u[driverField] = update.Driver
	}
	if update.Position != nil {
		u[positionField] = update.Position
	}

	res := m.col.FindOneAndUpdate(ctx, filter, mgo.Set(u), options.FindOneAndUpdate().SetReturnDocument(options.After))
	return covertSingResult(res)
}

func covertSingResult(res *mongo.SingleResult) (*CarRecord, error) {
	if err := res.Err(); err != nil {
		return nil, err
	}

	var cr CarRecord
	err := res.Decode(&cr)
	if err != nil {
		return nil, fmt.Errorf("cannot decode: %v", err)
	}

	return &cr, nil
}