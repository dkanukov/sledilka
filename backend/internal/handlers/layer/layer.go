package layer

import (
	"backend/internal/entity"
	"backend/internal/errors"
	"backend/internal/utils"
	"encoding/json"
	builinerrors "errors"
	"fmt"
	"github.com/google/uuid"
	gmux "github.com/gorilla/mux"
	"gorm.io/gorm"
	"log"
	"net/http"
	"os"
	"time"
)

// @Summary	Создать слой
// @Tags		layers
// @Accept		json
// @Produce	json
// @Param		request	body		entity.NewLayer true "Новый слой"
// @Param		id path string true "Object ID"
// @Success	200		{object}	entity.Layer
// @Failure	500
// @Router		/objects/{id}/layers [post]
func Post(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	id, err := uuid.Parse(idParam)
	if err != nil {
		errorMessage := errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errorMessage.WriteResponse(w)
		return
	}
	newReq, errRes := utils.ValidateBody[entity.NewLayer](r)
	if errRes != nil {
		errRes.WriteResponse(w)
	}
	if res := db.Find(&entity.Object{ID: id}); res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("object not found"))
		return
	}
	if _, err := os.Stat(fmt.Sprintf("images/%s", newReq.Image)); builinerrors.Is(err, os.ErrNotExist) {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("image not found"))
		return
	}
	if len(newReq.AnglesCoordinates) != 2 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("angles coordinates must be 2"))
		return
	}
	b, err := json.Marshal(&newReq.AnglesCoordinates)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err)
		return
	}
	layer := entity.LayerForDB{
		ObjectID:          id,
		FloorName:         newReq.FloorName,
		CoordinateX:       newReq.CoordinateX,
		CoordinateY:       newReq.CoordinateY,
		Image:             newReq.Image,
		Angle:             newReq.Angle,
		AnglesCoordinates: string(b),
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	if res := db.Create(&layer); res.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
	b, _ = json.Marshal(utils.DBFormatToLayer(layer))
	w.Write(b)
}

// @Summary	Изменить объект
// @Tags		layers
// @Accept		json
// @Produce	json
// @Param		request	body	entity.NewLayer	true	"Измененный слой"
// @Param		object_id path string true "Object ID"
// @Param		layer_id path string true "Layer ID"
// @Success	200	{object}	entity.Layer
// @Failure	500
// @Router		/objects/{object_id}/layers/{layer_id} [patch]
func Patch(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["layer_id"]
	id, err := uuid.Parse(idParam)
	if err != nil {
		errorMessage := errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errorMessage.WriteResponse(w)
		return
	}
	objectIdParam := gmux.Vars(r)["object_id"]
	objectId, err := uuid.Parse(objectIdParam)
	if err != nil {
		errorMessage := errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errorMessage.WriteResponse(w)
		return
	}
	layerDB := entity.LayerForDB{ID: id, ObjectID: objectId}
	res := db.Find(&layerDB)
	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	layer := utils.DBFormatToLayer(layerDB)
	if len(layer.AnglesCoordinates) != 2 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("angles coordinates must be 2"))
		return
	}
	if err = json.NewDecoder(r.Body).Decode(&layer); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	layer.UpdatedAt = time.Now()
	layerDB = utils.LayerToDBFormat(layer)
	db.Save(&layerDB)
	utils.SetDevices(db, &layer)
	json.NewEncoder(w).Encode(&layer)
}

//func GetById(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
//	idParam := gmux.Vars(r)["id"]
//	uuidId, err := uuid.Parse(idParam)
//	if err != nil {
//		errResp := &errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
//		errResp.WriteResponse(w)
//		return
//	}
//	object := entity.Object{ID: uuidId}
//	res := db.Find(&object)
//	if res.RowsAffected == 0 {
//		w.WriteHeader(http.StatusNotFound)
//		return
//	}
//	b, _ := json.Marshal(object)
//	w.Write(b)
//}
