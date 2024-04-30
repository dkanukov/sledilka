package app

import (
	"context"

	"networking-service/internal/conv"
	"networking-service/internal/network"
)

func (s *server) GetAllMacAddresses(context.Context, *network.Empty) (*network.GetAllMacAddressesResponse, error) {
	entries := s.arpHandler.GetTable()
	devs := make([]*network.DeviceStatus, 0, len(entries))
	for _, entry := range entries {
		devs = append(devs, conv.MacEntryToProto(entry))
	}
	return &network.GetAllMacAddressesResponse{Devices: devs}, nil
}
