package utils

import (
	"backend/internal/entity"
	"backend/internal/errors"
	"encoding/json"
	"gorm.io/gorm"
	"io"
	"math/rand"
	"net/http"
	"time"
)

func ValidateBody[T any](r *http.Request) (T, *errors.ResponseError) {
	b, err := io.ReadAll(r.Body)
	var newObj T
	if err != nil {
		return newObj, &errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
	}
	if err = json.Unmarshal(b, &newObj); err != nil {
		return newObj, &errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
	}
	return newObj, nil
}

func SetLayers(db *gorm.DB, object *entity.Object) {
	var layers []entity.Layer
	db.Find(&layers, &entity.Layer{ObjectID: object.ID})
	for i := range layers {
		SetDevices(db, &layers[i])
	}
	object.Layers = layers
}

func SetDevices(db *gorm.DB, layer *entity.Layer) {
	var devices []entity.Device
	db.Find(&devices, &entity.Device{LayerID: layer.ID})
	for i := range devices {
		devices[i].IsActive = RandBool()
	}
	layer.Devices = devices
}

func RandBool() bool {
	rand.Seed(time.Now().UnixNano())
	return rand.Intn(2) == 1
}
