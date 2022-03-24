package mgo

import (
	"coolcar/shared/mongo/objid"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

const (
	IDFieldName = "_id"
	UpdatedAtFieldName = "updatedat"
)

type IDField struct{
	ID primitive.ObjectID `bson:"_id"`
}

type UpdatedAtField struct {
	UpdatedAt int64	`bson:"updatedat"`
}

// Set common func use in set mongodb.
func Set(v interface{}) bson.M {
	return bson.M{
		"$set": v,
	}
}

// SetOnInsert： 如果查到就返回结果，查不到就新增记录 .
func SetOnInsert(v interface{}) bson.M {
	return bson.M{
		"$setOnInsert": v,
	}
}


var NewObjID = primitive.NewObjectID

func NewObjectIDWithValue(id fmt.Stringer) {
	NewObjID = func() primitive.ObjectID {
		return objid.MustFromID(id)
	}
}

var UpdatedAt = func() int64 {
	return time.Now().UnixNano()
}

// ZeroOrDoseNotExist 生成一个更新条件.
func ZeroOrDoseNotExist(field string, zero interface{}) bson.M  {
	return bson.M{
		"$or": []bson.M{
			{
				field: zero,
			},
			{
				field: bson.M{
					"$exists": false,
				},
			},
		},
	}
}