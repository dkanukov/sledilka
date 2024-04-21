package conv

import (
	"github.com/irai/arp"
	"net"
	"networking-service/internal/network"
)

func MacEntryToProto(entry arp.MACEntry) *network.DeviceStatus {
	dev := &network.DeviceStatus{
		MacAddress: entry.MAC.String(),
		IsActive:   entry.Online,
	}
	if ip := entry.IP().String(); ip != net.IP(nil).String() {
		dev.IpAddress = &ip
	}
	return dev
}
