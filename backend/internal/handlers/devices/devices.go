package devices

import (
	"backend/internal/conv"
	"backend/internal/dbmodel"
	"backend/internal/entity"
	"backend/internal/network"
)

func ToApi(dev dbmodel.Device) entity.Device {
	return entity.Device{
		Id:                  dev.ID,
		Name:                dev.Name,
		Type:                entity.DeviceType(dev.Type),
		LayerID:             dev.LayerID,
		LocationX:           dev.LocationX,
		LocationY:           dev.LocationY,
		Angle:               dev.Angle,
		IpAddress:           conv.StringpToString(dev.IpAddress),
		CameraConnectionURL: conv.StringpToString(dev.CameraConnectionUrl),
		MacAddress:          dev.MacAddress,
		CreatedAt:           dev.CreatedAt,
		UpdatedAt:           dev.UpdatedAt,
	}
}

func ListToApi(devs []dbmodel.Device) []entity.Device {
	if devs == nil || len(devs) == 0 {
		return []entity.Device{}
	}
	res := make([]entity.Device, 0, len(devs))
	for _, d := range devs {
		res = append(res, ToApi(d))
	}
	return res
}

func GetMacAddresses(devs []entity.Device) []*network.Device {
	res := make([]*network.Device, 0, len(devs))
	for _, d := range devs {
		res = append(res, &network.Device{MacAddress: d.MacAddress})
	}
	return res
}
