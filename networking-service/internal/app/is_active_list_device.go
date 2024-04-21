package app

import (
	"context"
	"log"
	"net"
	"networking-service/internal/conv"
	"networking-service/internal/network"
)

func (s *server) IsActiveListDevice(_ context.Context, req *network.IsActiveListDeviceRequest) (*network.IsActiveListDeviceResponse, error) {
	resp := make([]*network.DeviceStatus, 0, len(req.GetDevices()))
	for _, dev := range req.GetDevices() {
		mac, err := net.ParseMAC(dev.GetMacAddress())
		if err != nil {
			log.Printf("net.ParseMAC: %v\n", err)
			return nil, err
		}
		e, ok := s.arpHandler.FindMAC(mac)
		log.Println(e, ok)
		if !ok {
			resp = append(resp, &network.DeviceStatus{MacAddress: dev.GetMacAddress()})
		} else {
			resp = append(resp, conv.MacEntryToProto(e))
		}
	}
	return &network.IsActiveListDeviceResponse{Devices: resp}, nil
}
