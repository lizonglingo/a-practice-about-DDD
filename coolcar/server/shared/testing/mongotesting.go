package mongotesting

import (
	"context"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"testing"
)

const (
	image = "mongo:4.4.12"
	containerPort = "27017/tcp"
)

var mongoURI string
const defaultMongoURI = "mongodb://localhost:27017"

func RunWithMongoInDocker(m *testing.M) int {
	c, err := client.NewClientWithOpts()
	if err != nil {
		panic(err)
	}
	ctx := context.Background()

	// 第一次使用镜像需要先拉一下
	//reader, err := c.ImagePull(ctx, "mongo:4.4.12", types.ImagePullOptions{})
	//if err != nil {
	//	panic(err)
	//}
	//defer reader.Close()
	//io.Copy(os.Stdout, reader)

	resp, err := c.ContainerCreate(ctx, &container.Config{
		Image: image,
		ExposedPorts: nat.PortSet{
			containerPort: {},
		},
	},
		&container.HostConfig{
			PortBindings: nat.PortMap{
				containerPort: []nat.PortBinding{
					{
						HostIP:   "127.0.0.1",
						HostPort: "0",		// 给 0 会自动挑一个端口
					},
				},
			},
		}, nil, nil, "")
	if err != nil {
		panic(err)
	}

	defer func() {
		fmt.Println("kill container")
		err = c.ContainerRemove(ctx, resp.ID, types.ContainerRemoveOptions{Force: true})
		if err != nil {
			panic(err)
		}
	}()

	containerID := resp.ID
	err = c.ContainerStart(ctx, containerID, types.ContainerStartOptions{})
	if err != nil {
		panic(err)
	}
	fmt.Println("start container...")

	inspect, err := c.ContainerInspect(ctx, containerID)
	if err != nil {
		panic(err)
	}

	hostPort := inspect.NetworkSettings.Ports["27017/tcp"][0]
	mongoURI = fmt.Sprintf("mongodb://%s:%s/coolcar?readPreference=primary&ssl=false", hostPort.HostIP, hostPort.HostPort)
	fmt.Printf("listening at: %+v\n", inspect.NetworkSettings.Ports[containerPort][0])

	return m.Run()
}

func NewClient(c context.Context) (*mongo.Client, error) {
	if mongoURI == "" {
		return nil, fmt.Errorf("mongo uri not set. Please run RunWithMongoInDocker in Testmain.")
	}
	return mongo.Connect(c, options.Client().ApplyURI(mongoURI))
}

func NewDefaultClient(c context.Context) (*mongo.Client, error) {
	return mongo.Connect(c, options.Client().ApplyURI(defaultMongoURI))
}

func SetupIndexes(c context.Context, d *mongo.Database) error {
	_, err := d.Collection("account").Indexes().CreateOne(c, mongo.IndexModel{
		Keys: bson.D{	// 有序的键值对
			{Key: "open_id", Value: 1},
		},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		return err
	}

	_, err = d.Collection("trip").Indexes().CreateOne(c, mongo.IndexModel{
		Keys: bson.D{	// 有序的键值对
			{Key: "trip.accountid", Value: 1},
			{Key: "trip.status", Value: 1},
		},
		Options: options.Index().SetUnique(true).SetPartialFilterExpression(bson.M{
			"trip.status": 1,
		}),
	})
	return err
}


// docker run -p 18000:18000 -p 18001:18001 -p 27017:27017 -e ICODE=J19CA99F690CED0ED -v D:\Coding\WorkPlace\Golang\dockerVolumes\coolcar:/data/db ccr.ccs.tencentyun.com/coolcar/coolenv:latest