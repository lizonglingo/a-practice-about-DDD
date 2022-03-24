package dao

import (
	"context"
	rentalpb "coolcar/rental/api/gen/v1"
	"coolcar/shared/id"
	mgo "coolcar/shared/mongo"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	accountIDField      = "accountid"
	profileField        = "profile"
	identityStatusField = profileField + ".identitystatus"
	photoblobidFiled    = "photoblobid"
)

type Mongo struct {
	col *mongo.Collection
}

func NewMongo(db *mongo.Database) *Mongo {
	return &Mongo{col: db.Collection("profile")}
}

type ProfileRecord struct {
	AccountID   string            `bson:"accountid"`
	Profile     *rentalpb.Profile `bson:"profile"`
	PhotoBlobID string            `bson:"photoblobid"`
}

func (m *Mongo) GetProfile(c context.Context, aid id.AccountID) (*ProfileRecord, error) {
	res := m.col.FindOne(c, byAccountID(aid))
	if err := res.Err(); err != nil {
		return nil, err
	}

	var pr ProfileRecord
	err := res.Decode(&pr)
	if err != nil {
		return nil, fmt.Errorf("cannot decode profile record: %v", err)
	}

	return &pr, nil
}

func (m *Mongo) UpdateProfile(c context.Context, aid id.AccountID, p *rentalpb.Profile, prevState rentalpb.IdentityStatus) error {
	filter := bson.M{
		identityStatusField: prevState,
	} // 默认的查询条件

	if prevState == rentalpb.IdentityStatus_UNSUBMITTED {
		filter = mgo.ZeroOrDoseNotExist(identityStatusField, prevState)
	} // 如果前置没有合法profile 则在 驾照上传，以解析  和   驾照上传，未解析 状态下都可以进行更新

	filter[accountIDField] = aid.String()

	_, err := m.col.UpdateOne(c, filter,
		mgo.Set(bson.M{
			accountIDField: aid.String(),
			profileField:   p,
		}), options.Update().SetUpsert(true)) // 该 option 如果找到记录就更新 如果没找到就新建一条
	// 需要注意 创建 index 以保证更新操作的原子性
	return err
}

func (m *Mongo) UpdateProfilePhoto(c context.Context, aid id.AccountID, bid id.BlobID) error {
	_, err := m.col.UpdateOne(c, bson.M{
		accountIDField: aid.String(),
	}, mgo.Set(bson.M{
		accountIDField:   aid.String(),
		photoblobidFiled: bid.String(),
	}), options.Update().SetUpsert(true)) // 该 option 如果找到记录就更新 如果没找到就新建一条
	// 需要注意 创建 index 以保证更新操作的原子性
	return err
}

func byAccountID(aid id.AccountID) bson.M {
	return bson.M{
		accountIDField: aid.String(),
	}
}
