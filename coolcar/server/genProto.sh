PROTO_PATH=./auth/api
GO_OUT_PATH=./auth/api/gen/v1

protoc -I=$PROTO_PATH --go_out=$GO_OUT_PATH --go_opt=paths=source_relative --go-grpc_out=$GO_OUT_PATH --go-grpc_opt=paths=source_relative auth.proto
protoc -I=$PROTO_PATH --grpc-gateway_out $GO_OUT_PATH --grpc-gateway_opt paths=source_relative --grpc-gateway_opt grpc_api_configuration=$PROTO_PATH/auth.yaml auth.proto

PBTS_BIN_DIR=../wx/miniprogram/node_modules/.bin
PBTS_OUT_DIR=../wx/miniprogram/service/proto_gen/auth

$PBTS_BIN_DIR/pbjs -t static -w es6 $PROTO_PATH/auth.proto --no-create --no-encode --no-decode --no-verify --no-delimited -o $PBTS_OUT_DIR/auth_pb_temp.js

echo 'import * as $protobuf from "protobufjs";' > $PBTS_OUT_DIR/auth_pb.js
cat $PBTS_OUT_DIR/auth_pb_temp.js >> $PBTS_OUT_DIR/auth_pb.js
rm $PBTS_OUT_DIR/auth_pb_temp.js
$PBTS_BIN_DIR/pbts -o $PBTS_OUT_DIR/auth_pb.d.ts $PBTS_OUT_DIR/auth_pb.js