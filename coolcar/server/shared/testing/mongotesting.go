package mongotesting

import (
	"context"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
	"testing"
)

const (
	image = "mongo:4.4.12"
	containerPort = "27017/tcp"
)

func RunWithMongoInDocker(m *testing.M, mongoURI *string) int {
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
	*mongoURI = fmt.Sprintf("mongodb://%s:%s/coolcar?readPreference=primary&ssl=false", hostPort.HostIP, hostPort.HostPort)
	fmt.Printf("listening at: %+v\n", inspect.NetworkSettings.Ports[containerPort][0])

	return m.Run()
}