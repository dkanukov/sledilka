package devices

import (
	"backend/internal/entity"
	"backend/internal/errors"
	"backend/internal/utils"
	"encoding/json"
	"github.com/google/uuid"
	gmux "github.com/gorilla/mux"
	"gorm.io/gorm"
	"net"
	"net/http"
	"time"
)

// @Summary	Создать девайс
// @Tags		devices
// @Accept		json
// @Produce	json
// @Param		request	body		entity.NewDevice true "Новый девайс"
// @Success	200		{object}	entity.Device
// @Failure	500
// @Router		/devices [post]
func Post(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	newReq, errRes := utils.ValidateBody[entity.NewDevice](r)
	if errRes != nil {
		errRes.WriteResponse(w)
	}
	if res := db.Find(&entity.LayerForDB{ID: newReq.LayerID}); res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("layer not found"))
		return
	}

	if _, err := net.ParseMAC(newReq.MacAddress); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("invalid mac address"))
		return
	}
	if ok := entity.AvailableDeviceTypes[newReq.Type]; !ok {
		w.WriteHeader(http.StatusBadRequest)
		types, _ := json.Marshal(entity.AvailableDeviceTypes)
		w.Write(append([]byte("unavailable device type. available:"), types...))
		return
	}
	device := entity.Device{
		LayerID:    newReq.LayerID,
		Name:       newReq.Name,
		Type:       newReq.Type,
		LocationX:  newReq.LocationX,
		LocationY:  newReq.LocationY,
		IpAddress:  newReq.IpAddress,
		MacAddress: newReq.MacAddress,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	if res := db.Create(&device); res.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
	b, _ := json.Marshal(device)
	w.Write(b)
}

// @Summary	Изменить девайс
// @Tags		devices
// @Accept		json
// @Produce	json
// @Param		request	body	entity.NewDevice	true	"Измененный девайс"
// @Param		id path string true "Device ID"
// @Success	200	{object}	entity.Device
// @Failure	500
// @Router		/devices/{id} [patch]
func Patch(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	id, err := uuid.Parse(idParam)
	if err != nil {
		errorMessage := errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errorMessage.WriteResponse(w)
		return
	}
	device := entity.Device{Id: id}
	res := db.Find(&device)
	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	if err = json.NewDecoder(r.Body).Decode(&device); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	device.UpdatedAt = time.Now()
	db.Save(&device)
	json.NewEncoder(w).Encode(&device)
}
