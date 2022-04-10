DOMAIN=$1
VERSION=$2

docker tag coolcar/$DOMAIN registry.cn-hangzhou.aliyuncs.com/coolcar-lzl/$DOMAIN:$VERSION
docker push registry.cn-hangzhou.aliyuncs.com/coolcar-lzl/$DOMAIN:$VERSION