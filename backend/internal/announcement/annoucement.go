package announcement

import (
	"backend/internal/utils"
	"encoding/json"
	"github.com/google/uuid"
	gmux "github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
	"time"

	"backend/internal/entity"
	"backend/internal/errors"
)

func CreateNewAnnouncement(r *http.Request, db *gorm.DB) (entity.Announcement, *errors.ResponseError) {
	reqData, err := utils.ValidateBody[entity.NewAnnouncement](r)
	if err != nil {
		return entity.Announcement{}, err
	}
	announcToSave := entity.Announcement{
		Title:       reqData.Title,
		Description: reqData.Description,
		CreatedAt:   time.Now().String(),
	}
	res := db.Create(&announcToSave)
	if res.Error != nil {
		return announcToSave, &errors.ResponseError{StatusCode: http.StatusInternalServerError, Message: res.Error.Error()}
	}
	return announcToSave, nil
}

func DeleteAnnouncement(id string, db *gorm.DB) *errors.ResponseError {
	uuidId, err := uuid.Parse(id)
	if err != nil {
		return &errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
	}
	result := db.Delete(entity.Announcement{Id: uuidId})
	if result.RowsAffected == 0 {
		return &errors.ResponseError{StatusCode: http.StatusNotFound, Message: "Resource with this Id is not Found"}
	}
	return nil
}

// @Summary	Возвращает анонсы
// @Tags		announcements
// @Accept		json
// @Produce	json
// @Success	200	{object}	[]entity.Announcement
// @Failure	500
// @Router		/announcement [get]
func Get(w http.ResponseWriter, _ *http.Request, db *gorm.DB) {
	var announcements []entity.Announcement
	db.Find(&announcements)
	b, err := json.Marshal(announcements)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(b)
}

// @Summary	Создает анонс
// @Tags		announcements
// @Accept		json
// @Produce	json
// @Success	200	{object}	entity.Announcement
// @Failure	500
// @Router		/announcement [post]
// @Param		request	body	entity.NewAnnouncement	true	"тело нового запроса"
func Post(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	newAnnouncement, err := CreateNewAnnouncement(r, db)
	if err != nil {
		err.WriteResponse(w)
		return
	}
	b, _ := json.Marshal(newAnnouncement)
	w.Write(b)
}

// @Summary	Удаляет анонс
// @Tags		announcements
// @Accept		json
// @Produce	json
// @Success	200
// @Failure	500
// @Router		/announcement/{id} [delete]
// @Param		id	path  string	true	"uuid"
func Delete(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	err := DeleteAnnouncement(idParam, db)
	if err != nil {
		err.WriteResponse(w)
		return
	}
}

// @Summary	Анонс по id
// @Tags		announcements
// @Accept		json
// @Produce	json
// @Success	200	{object}	entity.Announcement
// @Failure	500
// @Router		/announcement/{id} [get]
// @Param		id	path  string	true	"uuid"
func GetById(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	uuidId, err := uuid.Parse(idParam)
	if err != nil {
		errResp := &errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errResp.WriteResponse(w)
		return
	}
	announce := entity.Announcement{Id: uuidId}
	res := db.Find(&announce)
	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	b, _ := json.Marshal(announce)
	w.Write(b)
}

// @Summary	Изменить анонс
// @Tags		announcements
// @Accept		json
// @Produce	json
// @Success	200	{object}	entity.Announcement
// @Failure	500
// @Router		/announcement/{id} [put]
// @Param		request	body	entity.NewAnnouncement	true	"Измененный анонс"
// @Param		id	path  string	true	"uuid"
func Put(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	uuidId, err := uuid.Parse(idParam)
	if err != nil {
		errResp := &errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errResp.WriteResponse(w)
		return
	}
	putAnnounce, errResp := utils.ValidateBody[entity.NewAnnouncement](r)
	if errResp != nil {
		errResp.WriteResponse(w)
		return
	}
	announce := entity.Announcement{Id: uuidId}
	res := db.Find(&announce)
	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	announce.Title = putAnnounce.Title
	announce.Description = putAnnounce.Description
	db.Save(&announce)
	b, _ := json.Marshal(announce)
	w.Write(b)
}

// @Summary	Изменить анонс
// @Tags		announcements
// @Accept		json
// @Produce	json
// @Success	200	{object}	entity.Announcement
// @Failure	500
// @Router		/announcement/{id} [patch]
// @Param		request	body	entity.NewAnnouncement	true	"Измененный анонс"
// @Param		id	path  string	true	"uuid"
func Patch(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	uuidId, err := uuid.Parse(idParam)
	if err != nil {
		errResp := &errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errResp.WriteResponse(w)
		return
	}
	announce := entity.Announcement{Id: uuidId}
	res := db.Find(&announce)
	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	if err = json.NewDecoder(r.Body).Decode(&announce); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	db.Save(&announce)

	json.NewEncoder(w).Encode(&announce)
}
