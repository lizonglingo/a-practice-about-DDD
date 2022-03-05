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
