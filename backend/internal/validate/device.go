package validate

import (
	"backend/internal/conv"
	"backend/internal/dbmodel"
	"backend/internal/entity"
	"backend/internal/utils"
	"database/sql"
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	gmux "github.com/gorilla/mux"
	"net"
	"net/http"
)

var (
	DeviceNotFound = errors.New("device not found")
)

func CreateDevice(r *http.Request) (dbmodel.CreateDeviceParams, error) {
	dev, err := utils.ValidateBody[dbmodel.CreateDeviceParams](r.Body)
	if err != nil {
		return dbmodel.CreateDeviceParams{}, err
	}

	if _, err = net.ParseMAC(dev.MacAddress); err != nil {
		return dbmodel.CreateDeviceParams{}, err
	}
	return dev, nil
}

func UpdateDevice(r *http.Request, q *dbmodel.Queries) (dbmodel.UpdateDeviceParams, error) {
	idParam := gmux.Vars(r)["id"]
	id, err := uuid.Parse(idParam)
	if err != nil {
		return dbmodel.UpdateDeviceParams{}, err
	}
	oldDev, err := q.GetDeviceById(r.Context(), id)
	switch {
	case errors.Is(err, sql.ErrNoRows):
		return dbmodel.UpdateDeviceParams{}, DeviceNotFound
	case err != nil:
		return dbmodel.UpdateDeviceParams{}, err
	}

	ip := ""
	if oldDev.IpAddress != nil {
		ip = *oldDev.IpAddress
	}
	dev := entity.NewDevice{
		Name:                oldDev.Name,
		Type:                entity.DeviceType(oldDev.Type),
		LayerID:             oldDev.LayerID,
		LocationX:           oldDev.LocationX,
		LocationY:           oldDev.LocationY,
		Angle:               oldDev.Angle,
		IpAddress:           ip,
		CameraConnectionURL: conv.StringpToString(oldDev.CameraConnectionUrl),
		MacAddress:          oldDev.MacAddress,
	}
	if err = json.NewDecoder(r.Body).Decode(&dev); err != nil {
		return dbmodel.UpdateDeviceParams{}, err
	}
	var ipp *string
	if dev.IpAddress != "" {
		ipp = &dev.IpAddress
	}
	return dbmodel.UpdateDeviceParams{
		ID:                  id,
		Type:                dbmodel.DeviceType(dev.Type),
		LayerID:             dev.LayerID,
		LocationX:           dev.LocationX,
		LocationY:           dev.LocationY,
		Angle:               dev.Angle,
		IpAddress:           ipp,
		MacAddress:          dev.MacAddress,
		CameraConnectionUrl: conv.StringToStringp(dev.CameraConnectionURL),
	}, nil
}
