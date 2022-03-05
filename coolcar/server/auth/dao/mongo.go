package dao

import (
	"context"
	mgo "coolcar/shared/mongo"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const openIDField = "open_id"

type Mongo struct {
	col *mongo.Collection	// mongo 中的表结构
}

// NewMongo 根据给出的数据库，从中获取操作的 account 表.
func NewMongo(db *mongo.Database) *Mongo  {
	return &Mongo{
		col: db.Collection("account"),
	}
}

// ResolveAccountID in: openID out: accountID.
func (m *Mongo) ResolveAccountID(c context.Context, openID string) (string, error) {
	res := m.col.FindOneAndUpdate(
		c,
		bson.M{
		openIDField: openID,
	},
	mgo.Set(bson.M{
		openIDField: openID,
	}),
	options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After))

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