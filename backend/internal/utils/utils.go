package utils

import (
	"backend/internal/entity"
	"backend/internal/errors"
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"io"
	"math/rand"
	"net/http"
	"sort"
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
	var layersDB []entity.LayerForDB
	db.Find(&layersDB, &entity.LayerForDB{ObjectID: object.ID})
	layers := make([]entity.Layer, len(layersDB))
	for i := range layersDB {
		layers[i] = DBFormatToLayer(layersDB[i])
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
		Image:     "capybara.jpg",
		FloorName: "1",
		Angle:     0,
		AnglesCoordinates: []entity.Coordinate{
			{
				Lat:  56.127655,
				Long: 37.210096,
			},
			{
				Lat:  56.127792,
				Long: 37.212361,
			},
			{
				Lat:  56.126285,
				Long: 37.212654,
			},
			{
				Lat:  56.126148,
				Long: 37.210389,
			},
		},
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
		Name:       "Камера в холле",
		Type:       entity.Camera,
		LayerID:    lay.ID,
		LocationX:  0,
		LocationY:  0,
		IpAddress:  "pipipi.mp4",
		MacAddress: "00:1b:63:84:45:e6",
	}
	body, _ = json.Marshal(newDev)
	http.Post(
		"http://localhost:8081/devices",
		"application/json",
		bytes.NewReader(body),
	)
}

// @Summary	Новые девайсы для слоя
// @Tags		new
// @Success	200
// @Param		id path string true "Layer ID"
// @Failure	500
// @Router		/layers/{id}/newDevices [post]
func NewDevices(layerID uuid.UUID) {
	newDevs := []entity.NewDevice{
		{
			Name:       "комп-" + uuid.NewString(),
			Type:       entity.Computer,
			LayerID:    layerID,
			LocationX:  0,
			LocationY:  0,
			IpAddress:  "127.0.0.1",
			MacAddress: "00:1b:63:84:45:e6",
		},
		{
			Name:       "камера-" + uuid.NewString(),
			Type:       entity.Camera,
			LayerID:    layerID,
			LocationX:  0,
			LocationY:  0,
			IpAddress:  "pipipi.mp4",
			MacAddress: "00:1b:63:84:45:e6",
		},
	}
	for _, dev := range newDevs {
		body, _ := json.Marshal(dev)
		http.Post(
			"http://localhost:8081/devices",
			"application/json",
			bytes.NewReader(body),
		)
	}
}

func LayerToDBFormat(layer entity.Layer) entity.LayerForDB {
	b, _ := json.Marshal(&layer.AnglesCoordinates)
	return entity.LayerForDB{
		ID:                layer.ID,
		ObjectID:          layer.ObjectID,
		FloorName:         layer.FloorName,
		Image:             layer.Image,
		Angle:             layer.Angle,
		AnglesCoordinates: string(b),
		CreatedAt:         layer.CreatedAt,
		UpdatedAt:         layer.UpdatedAt,
	}
}

func DBFormatToLayer(layer entity.LayerForDB) entity.Layer {
	var coors []entity.Coordinate
	_ = json.Unmarshal([]byte(layer.AnglesCoordinates), &coors)
	sort.Slice(coors, func(i, j int) bool {
		return coors[i].Lat < coors[j].Lat
	})
	return entity.Layer{
		ID:                layer.ID,
		ObjectID:          layer.ObjectID,
		FloorName:         layer.FloorName,
		Image:             layer.Image,
		Angle:             layer.Angle,
		AnglesCoordinates: coors,
		CreatedAt:         layer.CreatedAt,
		UpdatedAt:         layer.UpdatedAt,
	}
}
