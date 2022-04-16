# 用Istio进行服务治理

> 在K8s上搭建好微服务后，使用Istio的能力实现微服务治理。

通过Istio的能力，可以实现：

- 微服务可视化
- 链路追踪
- 集群网关
- 故障注入
- 灰度发布
- ...

## 安装Istio

### 安装客户端istioctl

这里使用[1.10版本](https://github.com/istio/istio/releases/tag/1.10.0)。将对应版本的压缩包下好解压，将`bin`添加到环境变量中。

![image-20220416173630279](https://picgo-lzl.oss-cn-beijing.aliyuncs.com/image-20220416173630279.png)

```shell
export PATH=$PATH:/home/lzl/App/istio-1.10.0/bin
# istioctl version
client version: 1.10.0
control plane version: 1.10.0
data plane version: 1.10.0 (8 proxies)
```

### 使用demo版本将istio安装到K8s集群中

使用实例的profile将istio安装到集群中：

```shell
istioctl install --set profile=demo
```

然后安装istio的插件：

```shell
kubectl apply -f <istio>/samples/addons
```

查看组件状态：

```shell
root@lzl-a:/home/lzl# kubectl get pods -n istio-system
NAME                                    READY   STATUS    RESTARTS   AGE
grafana-55d799dd4b-hqb67                1/1     Running   0          4h9m
istio-egressgateway-5fc9c96f5b-cxk6t    1/1     Running   0          4h11m
istio-ingressgateway-84658cd9d6-26pwm   1/1     Running   0          4h11m
istiod-75695567cb-r6tng                 1/1     Running   0          4h11m
jaeger-94b78b448-s5lff                  1/1     Running   0          4h9m
kiali-6897d4f87b-qvg8s                  1/1     Running   0          4h9m
prometheus-57c5d768f8-khvzt             2/2     Running   0          4h9m
```

### 配置namespace，启用istio代理自动注入

```shell
kubectl label namespace default istio-injection=enabled
```

这样，所有在`default`命名空间中的新部署的容器都会自动注入envoy sidecar。

> 除了启动istio代理自动注入外，还可以使用手动方式对某次部署使用sidercar注入。方法如下：

```shell
istioctl kube-inject -f xxx.yaml | kubectl apply -f -
```

`kube-inject -f`由istioctl生成中间的部署文件，然后再交给kubectl进行部署。

### 删除istio清空环境

```shell
istioctl x uninstall --purge
```

## 重新部署我们之前的微服务

在部署前，需要修改容器Container和服务Service的配置，使其满足Istio的要求：

- container: container port
- container: app label
- container: version label
- service: port name

这些会用于istio代理去标识容器和通信协议。以下面的yaml为例：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: car
  labels:
    app: car
spec:
  replicas: 1
  selector:
    matchLabels:
      app: car
  template:
    metadata:
      labels:
        app: car		# 用于选择服务
        version: v1.3	# istio基于此标识服务版本
    spec:
      containers:
      - name: car
        image: registry.cn-hangzhou.aliyuncs.com/coolcar-lzl/car:1.3
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 9090	# 用于代理流量
        - containerPort: 8080	# 同上
       ...
---
apiVersion: v1
kind: Service
metadata:
  name: car
spec:
  selector:
    app: car
  ports:
  - name: grpc			# 用于标识协议
    protocol: TCP
    port: 9090
  - name: http			# 用于标识协议
    protocol: TCP
    port: 8080
...
```

由于前面使用了`istio-injection=enabled`，重新部署容器时，会自动在Pod中以sidecar模式再部署一个istio代理。

```shell
NAME                       READY   STATUS    RESTARTS   AGE
car-764c4f78c-fkchp        2/2     Running   1          3h50m
```

可以看到该实例中有两个容器，一个是我们自己的容器，另一个是istio为我们注入的容器。

## ServiceEntry和Istio Ingress

基于istio的能力，可以对进入应用和离开应用的流量进行管控。

### ServiceEntry

ServiceEntry配置了系统向集群外部的流量。默认情况下允许向任何集群外部的服务器发送请求。我们可以通过istio-proxy的日志看到集群外部的流向，并且通过如下配置将它们管理起来。这里列举了微信服务器的配置。

```shell
apiVersion: networking.istio.io/v1alpha3
kind: ServiceEntry
metadata:
  name: wechat
spec:
  hosts:
  - api.weixin.qq.com	# 流向这个地址
  ports:
  - number: 443
    name: https
    protocol: HTTPS
  resolution: DNS		# 需要使用DNS进行域名解析
  location: MESH_EXTERNAL
```

### 使用Ingress统一管理进入集群的流量

首先查看istio-ingress是否开启：

```shell
root@lzl-a:/home/lzl# kubectl get svc istio-ingressgateway -n istio-system
NAME                   TYPE           CLUSTER-IP       EXTERNAL-IP      PORT(S)                                                                      AGE
istio-ingressgateway   LoadBalancer   172.16.254.236   139.152.68.112   15021:31450/TCP,80:31005/TCP,443:31735/TCP,31400:32063/TCP,15443:32757/TCP   4h47m
```

其中`EXTERNAL-IP`就是istio的统一入口。

然后使用下面的配置开启istio-ingress:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: istio-gateway
spec:
  selector:
    istio: ingressgateway	# 使用istio网关
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"					# 匹配所有规则
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService		# 使用virtualService完成流量引导
metadata:
  name: app-gateway
spec:
  hosts:
  - "*"
  gateways:
  - istio-gateway			# 使用上面定义的istio-gateway
  http:						# http匹配规则 规则应用顺序是自上而下的 需要注意下
  - match:
    - uri:
        prefix: /ws
    route:
    - destination:
        port:
          number: 8080
        host: car
  - route:
    - destination:
        port:
          number: 8080
        host: gateway
```





