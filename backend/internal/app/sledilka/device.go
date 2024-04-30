package sledilka

import (
	"backend/internal/authorization"
	"backend/internal/conv"
	"backend/internal/utils"
	"context"
	"errors"
	"fmt"
	"github.com/gorilla/mux"
	"log"
	"net/http"

	"backend/internal/dbmodel"
	"backend/internal/entity"
	"backend/internal/handlers/devices"
	"backend/internal/network"
	"backend/internal/validate"
)

type (
	CreateDevice dbmodel.CreateDeviceParams
	Device       entity.Device
	UpdateDevice entity.NewDevice
)

func (s *Sledilka) addDeviceHandlers(router *mux.Router) {
	router.HandleFunc("/devices", authorization.JwtAuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			device, err := s.createDevice(r)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				fmt.Fprint(w, err)
				return
			}
			fmt.Fprint(w, utils.MustJSON(device))
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}, s.tokener)).Methods(http.MethodPost)

	router.HandleFunc("/devices/{id}", authorization.JwtAuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPatch:
			newDev, err := s.updateDevice(r)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				fmt.Fprint(w, err)
				return
			}
			fmt.Fprint(w, utils.MustJSON(newDev))
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}, s.tokener)).Methods(http.MethodPatch)
}

// @Summary	Создать девайс
// @Tags		devices
// @Accept		json
// @Produce	json
// @Param		request	body		CreateDevice true "Новый девайс"
// @Success	200		{object}	Device
// @Security ApiKeyAuth
// @Failure	500
// @Router		/devices [post]
func (s *Sledilka) createDevice(r *http.Request) (entity.Device, error) {
	createDeviceParams, err := validate.CreateDevice(r)
	if err != nil {
		return entity.Device{}, err
	}
	dbDevice, err := s.q.CreateDevice(r.Context(), dbmodel.CreateDeviceParams(createDeviceParams))
	if err != nil {
		return entity.Device{}, err
	}
	dev := entity.Device{
		Id:                  dbDevice.ID,
		Name:                dbDevice.Name,
		Type:                entity.DeviceType(dbDevice.Type),
		LayerID:             dbDevice.LayerID,
		LocationX:           dbDevice.LocationX,
		LocationY:           dbDevice.LocationY,
		Angle:               dbDevice.LocationY,
		IpAddress:           conv.StringpToString(dbDevice.IpAddress),
		CameraConnectionURL: conv.StringpToString(dbDevice.CameraConnectionUrl),
		MacAddress:          dbDevice.MacAddress,
		CreatedAt:           dbDevice.CreatedAt,
		UpdatedAt:           dbDevice.UpdatedAt,
	}
	resp, err := s.networker.IsActiveListDevice(r.Context(), &network.IsActiveListDeviceRequest{
		Devices: []*network.Device{{
			MacAddress: dev.MacAddress,
		}},
	})
	if err != nil {
		log.Println(fmt.Errorf("s.networker.IsActiveListDevice: %w", err))
		return dev, nil
	}
	if len(resp.GetDevices()) == 0 {
		return dev, errors.New("empty IsActiveListDevice resp")
	}
	dev.IsActive = resp.GetDevices()[0].IsActive
	dev.IpAddress = resp.GetDevices()[0].GetIpAddress()

	return dev, nil
}

// @Summary	Изменить девайс
// @Tags		devices
// @Accept		json
// @Produce	json
// @Param		request	body	UpdateDevice	true	"Измененный девайс"
// @Param		id path string true "Device ID"
// @Success	200	{object}	entity.Device
// @Security ApiKeyAuth
// @Failure	500
// @Router		/devices/{id} [patch]
func (s *Sledilka) updateDevice(r *http.Request) (entity.Device, error) {
	updDevice, err := validate.UpdateDevice(r, s.q)
	if err != nil {
		return entity.Device{}, err
	}
	dev, err := s.q.UpdateDevice(r.Context(), updDevice)
	if err != nil {
		return entity.Device{}, err
	}
	devResp := devices.ToApi(dev)
	status, err := s.isActive(r.Context(), dev.MacAddress)
	if err != nil {
		log.Println(err)
		return devResp, nil
	}
	devResp.IsActive = status.GetIsActive()
	devResp.IpAddress = status.GetIpAddress()
	return devResp, nil

}

func (s *Sledilka) isActive(ctx context.Context, macAddress string) (*network.DeviceStatus, error) {
	resp, err := s.networker.IsActiveListDevice(ctx, &network.IsActiveListDeviceRequest{
		Devices: []*network.Device{{
			MacAddress: macAddress,
		}},
	})
	if err != nil {
		return nil, err
	}
	if len(resp.GetDevices()) == 0 {
		return nil, errors.New("empty IsActiveListDevice resp")
	}
	return resp.GetDevices()[0], nil
}
