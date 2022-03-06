package mgo

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const IDField = "_id"

type ObjID struct{
	ID primitive.ObjectID `bson:"_id"`
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
