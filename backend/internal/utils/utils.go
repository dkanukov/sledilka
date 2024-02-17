package utils

import (
	"backend/internal/entity"
	"backend/internal/errors"
	"bytes"
	"encoding/json"
	"fmt"
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

// @Summary	Новые сущности
// @Tags		new
// @Success	200
// @Failure	500
// @Router		/new [post]
func NewEntities() {
	newObj := entity.NewObject{
		Name:        "MIEM",
		Address:     "гор. Москва, ул. Таллинская, д.34",
		Description: "корпус НИУ ВШЭ",
	}
	body, _ := json.Marshal(newObj)
	resp, _ := http.Post(
		"http://localhost:8081/objects",
		"application/json",
		bytes.NewReader(body),
	)
	if resp.StatusCode != 200 {
		return
	}
	var obj entity.Object
	body, _ = io.ReadAll(resp.Body)
	json.Unmarshal(body, &obj)
	newLayer := entity.NewLayer{
		Image:       "capybara.jpg",
		FloorName:   "1",
		CoordinateY: 10,
		CoordinateX: 10,
		Angle:       0,
	}
	body, _ = json.Marshal(newLayer)
	resp, _ = http.Post(
		fmt.Sprintf("http://localhost:8081/objects/%s/layers", obj.ID),
		"application/json",
		bytes.NewReader(body),
	)
	if resp.StatusCode != 200 {
		return
	}
	var lay entity.Layer
	body, _ = io.ReadAll(resp.Body)
	json.Unmarshal(body, &lay)
	newDev := entity.NewDevice{
		Name:       "комп твоей мамаши",
		Type:       entity.Computer,
		LayerID:    lay.ID,
		LocationX:  0,
		LocationY:  0,
		IpAddress:  "127.0.0.1",
		MacAddress: "00:1b:63:84:45:e6",
	}
	body, _ = json.Marshal(newDev)
	http.Post(
		"http://localhost:8081/devices",
		"application/json",
		bytes.NewReader(body),
	)
}
