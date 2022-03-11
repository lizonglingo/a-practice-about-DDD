package dao

import (
	"context"
	"coolcar/shared/id"
	mgo "coolcar/shared/mongo"
	"coolcar/shared/mongo/objid"
	mongotesting "coolcar/shared/testing"
	"go.mongodb.org/mongo-driver/bson"
	"os"
	"testing"
)


var mongoURI string

func TestMain(m *testing.M) {
	os.Exit(mongotesting.RunWithMongoInDocker(m))
}

func TestMongo_ResolveAccountID(t *testing.T) {
	c := context.Background()
	mc, err := mongotesting.NewClient(c)
	if err != nil {
		t.Fatalf("cannot connect mongodb: %v\n", err)
	}

	// 初始化数据库
	m := NewMongo(mc.Database("coolcar"))
	_, err = m.col.InsertMany(c, []interface{}{
		bson.M{
			mgo.IDFieldName: objid.MustFromID(id.AccountID("6223554ecd96314f99e7e088")),
			openIDField:     "open_id_1",
		},
		bson.M{
			mgo.IDFieldName: objid.MustFromID(id.AccountID("6223554ecd96314f99e7e09a")),
			openIDField:     "open_id_2",
		},
	})
	if err != nil {
		t.Fatalf("cannot insert initail values: %v\n", err)
	}

	// 为新用户设置的 objID
	mgo.NewObjectIDWithValue(id.AccountID("6223554ecd96314f99e7e09b"))

	// 测试数据
	cases := [] struct{
		name string
		openID string
		want string
	}{
		{
			name: "existing_user",
			openID: "open_id_1",
			want: "6223554ecd96314f99e7e088",
		},
		{
			name: "ano_existing_user",
			openID: "open_id_2",
			want: "6223554ecd96314f99e7e09a",
		},
		{
			name: "new_user",
			openID: "open_id_3",
			want: "6223554ecd96314f99e7e09b",
		},
	}

	// 对数据进行循环测试
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {	// t.Run 运行子测试
			objID, err := m.ResolveAccountID(context.Background(), c.openID)	// 需要新的上下文，因为是新的生命周期
			if err != nil {
				t.Errorf("fail resolve open_id for %q: %v", c.openID, err)
			}
			if objID.String() != c.want {
				t.Errorf("resolve account id: want: %q, got: %q\n", c.want, objID)
			}
		})
	}

}
