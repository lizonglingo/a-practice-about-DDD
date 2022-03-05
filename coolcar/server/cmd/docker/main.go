package main

import (
	"context"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
	"time"
)

func main() {
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
		Image: "mongo:4.4.12",
		ExposedPorts: nat.PortSet{
			"27017/tcp": {},
		},
	},
		&container.HostConfig{
			PortBindings: nat.PortMap{
				"27017/tcp": []nat.PortBinding{
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

	err = c.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{})
	if err != nil {
		panic(err)
	}

	fmt.Println("start container")
	time.Sleep(5 * time.Second)

	inspect, err := c.ContainerInspect(ctx, resp.ID)
	if err != nil {
		panic(err)
	}
	fmt.Printf("listening at: %+v\n", inspect.NetworkSettings.Ports["27017/tcp"][0])

	fmt.Println("kill container")
	err = c.ContainerRemove(ctx, resp.ID, types.ContainerRemoveOptions{Force: true})
	if err != nil {
		panic(err)
	}
}
