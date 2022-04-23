package profile

import (
	"context"
	rentalpb "coolcar/rental/api/gen/v1"
	"coolcar/shared/id"
	"encoding/base64"
	"fmt"
	"google.golang.org/protobuf/proto"
)

type Fetcher interface {
	GetProfile(ctx context.Context, request *rentalpb.GetProfileRequest) (*rentalpb.Profile, error)
}

type Manager struct {
	Fetcher Fetcher
}

// Verify 验证驾驶证信息是否已被审核.
//  message Identity {
//  string  lic_number = 1;
//  string name = 2;
//  Gender gender = 3;
//  int64 brith_date_millis = 4;
//  }
//
// message Profile {
//  Identity identity = 1;
//  IdentityStatus identity_status = 2;
// }
func (m *Manager) Verify(ctx context.Context, aid id.AccountID) (id.IdentityID, error) {
	nilID := id.IdentityID("")
	p, err := m.Fetcher.GetProfile(ctx, &rentalpb.GetProfileRequest{})
	if err != nil {
		return nilID, fmt.Errorf("cannot get profile: %v", err)
	}

	if p.IdentityStatus != rentalpb.IdentityStatus_VERIFIED {
		return nilID, fmt.Errorf("invalid identity status")
	}

	b, err := proto.Marshal(p.Identity)
	if err != nil{
		return nilID, fmt.Errorf("cannot marshal identity: %v", err)
	}

	return id.IdentityID(base64.StdEncoding.EncodeToString(b)), nil
}

