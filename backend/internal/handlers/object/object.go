package object

import (
	"backend/internal/entity"
	"backend/internal/errors"
	"backend/internal/utils"
	"encoding/json"
	"github.com/google/uuid"
	gmux "github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
	"time"
)

// @Summary	Возвращает все объекты
// @Tags		objects
// @Accept		json
// @Produce	json
// @Success	200	{object}	[]entity.Object
// @Failure	500
// @Router		/objects [get]
func Get(w http.ResponseWriter, _ *http.Request, db *gorm.DB) {
	var objects []entity.Object
	db.Find(&objects)
	for i := range objects {
		utils.SetLayers(db, &objects[i])
	}
	b, _ := json.Marshal(objects)
	w.Write(b)
}

// @Summary	Создать объект
// @Tags		objects
// @Accept		json
// @Produce	json
// @Param		request	body		entity.NewObject true "Новый отзыв"
// @Success	200		{object}	entity.Object
// @Failure	500
// @Router		/objects [post]
func Post(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	newReq, err := utils.ValidateBody[entity.NewObject](r)
	if err != nil {
		err.WriteResponse(w)
	}
	object := entity.Object{
		Name:        newReq.Name,
		Address:     newReq.Address,
		Description: newReq.Description,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	if res := db.Create(&object); res.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
	b, _ := json.Marshal(object)
	w.Write(b)
}

// @Summary	Изменить объект
// @Tags		objects
// @Accept		json
// @Produce	json
// @Param		request	body	entity.NewObject	true	"Измененный Объект"
// @Param		id path string true "Object ID"
// @Success	200	{object}	entity.Object
// @Failure	500
// @Router		/objects/{id} [patch]
func Patch(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	id, err := uuid.Parse(idParam)
	if err != nil {
		errorMessage := errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errorMessage.WriteResponse(w)
		return
	}
	object := entity.Object{ID: id}
	res := db.Find(&object)
	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	if err = json.NewDecoder(r.Body).Decode(&object); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	object.UpdatedAt = time.Now()
	db.Save(&object)
	utils.SetLayers(db, &object)
	json.NewEncoder(w).Encode(&object)
}

// @Summary	Объект по id
// @Tags		objects
// @Accept		json
// @Produce	json
// @Success	200	{object}	entity.Object
// @Failure	500
// @Router		/objects/{id} [get]
// @Param		id	path  string	true	"uuid"
func GetById(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	uuidId, err := uuid.Parse(idParam)
	if err != nil {
		errResp := &errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errResp.WriteResponse(w)
		return
	}
	object := entity.Object{ID: uuidId}
	res := db.Find(&object)
	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	utils.SetLayers(db, &object)
	b, _ := json.Marshal(object)
	w.Write(b)
}
