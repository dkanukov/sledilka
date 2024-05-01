package utils

import (
	"backend/internal/dbmodel"
	"backend/internal/entity"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
)

func ValidateBody[T any](r io.Reader) (T, error) {
	b, err := io.ReadAll(r)
	var newObj T
	if err != nil {
		return newObj, err
	}
	if err = json.Unmarshal(b, &newObj); err != nil {
		return newObj, err
	}
	return newObj, nil
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
		AnglesCoordinates: dbmodel.AnglesCoordinates{
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

func MustJSON(obj any) string {
	b, err := json.Marshal(obj)
	if err != nil {
		panic(err)
	}
	return string(b)
}

func RandBool() bool {
	return rand.Int()%2 == 1
}
