package dao

import (
	"context"
	mgo "coolcar/shared/mongo"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const openIDField = "open_id"

type Mongo struct {
	col      *mongo.Collection // mongo 中的表结构
	newObjID func() primitive.ObjectID
}

// NewMongo 根据给出的数据库，从中获取操作的 account 表.
func NewMongo(db *mongo.Database) *Mongo {
	return &Mongo{
		col:      db.Collection("account"),
		newObjID: primitive.NewObjectID, // 不加()就是一个函数类型
	}
}

// ResolveAccountID in: openID out: accountID.
func (m *Mongo) ResolveAccountID(c context.Context, openID string) (string, error) {

	insertedID := m.newObjID()
	res := m.col.FindOneAndUpdate(
		c,
		bson.M{
			openIDField: openID,
		},	// 按照该条件进行查询，查到了就返回，查不到就按照下面的更新条件进行插入
		mgo.SetOnInsert(bson.M{
			mgo.IDField: insertedID,
			openIDField: openID,
		}),	// 插入新记录
		options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After),	// 选项：返回更新后的结果
		)

	if err := res.Err(); err != nil {
		return "", fmt.Errorf("cannot findOneAndUpdate: %v\n", err)
	}

	var row mgo.ObjID
	err := res.Decode(&row)
	if err != nil {
		return "", fmt.Errorf("cannot decode result: %v\n", err)
	}
	return row.ID.Hex(), nil
}
