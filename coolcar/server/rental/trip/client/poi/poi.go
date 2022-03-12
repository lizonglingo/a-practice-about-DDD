package poi

import (
	"context"
	rentalpb "coolcar/rental/api/gen/v1"
	"google.golang.org/protobuf/proto"
	"hash/fnv"
)

var poi = []string{
	"地点1",
	"地点2",
	"地点3",
	"地点4",
	"地点5",
	"地点6",
	"地点7",
	"地点8",
}

type Manager struct {

}

func (m *Manager) Resolve(ctx context.Context, location *rentalpb.Location) (string, error) {
	byte, err := proto.Marshal(location)
	if err != nil {
		return "", err
	}
	h := fnv.New32()
	h.Write(byte)
	return poi[int(h.Sum32())%len(poi)], nil
}
