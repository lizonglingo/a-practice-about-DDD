# 启动编译环境 第一阶段
FROM golang:1.16-alpine AS builder

# 配置编译环境
RUN go env -w GO111MODULE=on
RUN go env -w GOPROXY=https://goproxy.cn,direct

# 拷贝源代码到镜像中
COPY . /go/src/coolcar/server

# 方案1： 编译 使用跨平台交叉编译
# CGO_ENABLED涉及到编译过程中如链接等底层内容
# 这样编译的文件就能在alpine中跑
# 方案2： 在golang的alpine版本进行编译 直接可在 Linux下运行
WORKDIR /go/src/coolcar/server
RUN go install ./gateway/...

# 将编译后的可执行文件放入新的环境 构建生产镜像 第二阶段
FROM alpine:3.13
COPY --from=builder /go/bin/gateway /bin/gateway
# 所有http暴露在8080 gRPC暴露在9090
ENV ADDR=:8080

# 将端口暴露（容器中的端口）有了此端口，可使用 docker run  -p 将这个端口与容器外部端口连接
EXPOSE 8080

# 设置服务入口
ENTRYPOINT [ "/bin/gateway" ]
