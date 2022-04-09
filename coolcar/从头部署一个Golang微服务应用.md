# 从头部署一个Golang微服务应用

## 制作Docker镜像

### 代码在哪里编译？构建Golang编译环境

思路是首先拉取并进入go的容器：

```shell
>docker run -it golang:1.16
Unable to find image 'golang:1.16' locally
1.16: Pulling from library/golang
e4d61adff207: Pull complete
4ff1945c672b: Pull complete
ff5b10aec998: Pull complete
12de8c754e45: Pull complete
8c86ff77a317: Pull complete
0395a1c478ba: Pull complete
245345d44ed8: Pull complete
Digest: sha256:5f6a4662de3efc6d6bb812d02e9de3d8698eea16b8eb7281f03e6f3e8383018e
Status: Downloaded newer image for golang:1.16
root@beea2791a55d:/go# ls
bin  src
root@beea2791a55d:/go# go env
GO111MODULE=""
...
GOPATH="/go"
GOPRIVATE=""
GOPROXY="https://proxy.golang.org,direct"
...
root@beea2791a55d:/go# go env -w GO111MODULE=on
root@beea2791a55d:/go# go env -w GOPROXY=https://goproxy.cn,direct
```

配好环境后，要将我们的源代码拷进`/go/src`目录中，使用`go install`后将被编译到`/go/bin`目录下。

### 构建Dockerfile自动化完成上述内容

以`gateway`服务为例进行尝试：

```dockerfile
# 启动编译环境
FROM golang:1.16

# 配置编译环境
RUN go env -w GO111MODULE=on
RUN go env -w GOPROXY=https://goproxy.cn,direct

# 拷贝源代码到镜像中 注意 [源目录] 以及 执行 [docker build] 的目录
COPY . /go/src/coolcar/server

# 编译
WORKDIR /go/src/coolcar/server
RUN go install ./gateway/...

# 并不真正向外界暴露端口 只是让你知道
# 可使用 docker run  -p 将这个端口与容器外部端口连接
EXPOSE 8123

# 设置服务入口
ENTRYPOINT [ "/go/bin/gateway" ]
```

> 这里注意`ENTRYPOINT`和`CMD`的区别。
>
> 实际上，这二者是连起来用的，如：
>
> ENTRYPOINT [ "echo",  "a" ]
>
> CMD ["b"]
>
> 那么就会输出： `a b`
>
> 但是如果在运行镜像时，有：`docker run image-name c d`
>
> 则会输出：`a c d`。
>
> 简单说，`ENTRYPOINT`是必须执行的，写死的，而`CMD`在没有给出额外参数时作为默认的命令，有额外参数时则会覆盖`CMD`的内容。所以如果有命令想让用户重写，就加上`CMD`。

`docker build -t 编译后镜像的名字 -f 对应的Dockerfile 进行编译的目录 `

```shell
> docker build -t coolcar/gateway -f ..\deployment\gateway\Dockerfile .
[+] Building 1.3s (9/9) FINISHED
 => [internal] load build definition from Dockerfile                                                                               0.0s 
 => => transferring dockerfile: 282B                                                                                               0.0s 
 => [internal] load .dockerignore                                                                                                  0.0s 
 => [1/4] FROM docker.io/library/golang:1.16                                                                                       0.2s 
 => [internal] load build context                                                                                                  0.1s 
 => => transferring context: 967.34kB                                                                                              0.1s 
 => [2/4] RUN go env -w GO111MODULE=on                                                                                             0.4s 
 => [3/4] RUN go env -w GOPROXY=https://goproxy.cn,direct                                                                          0.5s 
 => [4/4] COPY . /go/src/coolcar/server                                                                                            0.0s 
 => exporting to image                                                                                                             0.1s 
 => => exporting layers                                                                                                            0.0s 
 => => writing image sha256:0fa1daf5e1c2bb1d81f23125e5625762d69b773c8e1b299f7840678dccd96def                                       0.0s 
 => => naming to docker.io/coolcar/gateway                                                                                         0.0s 

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
PS D:\Coding\WorkPlace\Golang\a-practice-about-DDD\coolcar\server> docker build -t coolcar/gateway -f ..\deployment\gateway\Dockerfile .

[+] Building 22.7s (11/11) FINISHED
 => [internal] load build definition from Dockerfile                                                                               0.0s 
 => => transferring dockerfile: 378B                                                                                               0.0s 
 => [internal] load .dockerignore                                                                                                  0.0s 
 => => transferring context: 2B                                                                                                    0.0s 
 => [internal] load metadata for docker.io/library/golang:1.16                                                                     0.0s 
 => [1/6] FROM docker.io/library/golang:1.16                                                                                       0.0s 
 => [internal] load build context                                                                                                  0.1s 
 => => transferring context: 5.59kB                                                                                                0.0s 
 => CACHED [2/6] RUN go env -w GO111MODULE=on                                                                                      0.0s 
 => CACHED [3/6] RUN go env -w GOPROXY=https://goproxy.cn,direct                                                                   0.0s 
 => CACHED [4/6] COPY . /go/src/coolcar/server                                                                                     0.0s 
 => [5/6] WORKDIR /go/src/coolcar/server                                                                                           0.0s 
 => [6/6] RUN go install ./gateway/...                                                                                            20.2s 
 => exporting to image                                                                                                             2.3s 
 => => exporting layers                                                                                                            2.3s 
 => => writing image sha256:ba352f8a4b9d6eb5d06e1703a6b9989e0c4d8f31bfa4edefd479cefdc38935d9                                       0.0s 
 => => naming to docker.io/coolcar/gateway                                                                                         0.0s 

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
> docker image ls
REPOSITORY                               TAG                                                     IMAGE ID       CREATED          SIZE
coolcar/gateway                          latest                                                  ba352f8a4b9d   32 seconds ago   1.19GB 
```

镜像太大，需要进行瘦身。

### 镜像瘦身

思路是**在中间镜像中进行编译**，编译完成后**将可执行文件放入真正的生产镜像**。

首先有一个问题，上面的编译后的可执行文件不能在alpine中运行，所以：

```dockerfile
# 编译 使用跨平台交叉编译
# CGO_ENABLED涉及到编译过程中如链接等底层内容
# 这样编译的文件就能在alpine中跑
WORKDIR /go/src/coolcar/server
RUN CGO_ENABLED=0 GOOS=linux go install ./gateway/...
```

或者，直接基于alpine的golang进行编译：

```dockerfile
FROM golang:1.16-alpine
```

但是这样编译的镜像仍有几百MB。

#### Docker的强大功能 —— 多阶段构建



