package announcement

import (
	"backend/internal/utils"
	"encoding/json"
	"github.com/google/uuid"
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
	uuidId, err := uuid.FromBytes([]byte(id))
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
	}
	b, _ := json.Marshal(newAnnouncement)
	w.Write(b)
}

// @Summary	Удаляет анонс
// @Tags		announcements
// @Accept		json
// @Produce	json
// @Success	200	{object}	entity.Announcement
// @Failure	500
// @Router		/announcement [delete]
// @Param		id	query	int	true	"ID анонса на удаление"
func Delete(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	query := r.URL.Query()
	id := query.Get("id")
	err := DeleteAnnouncement(id, db)
	if err != nil {
		err.WriteResponse(w)
	}
}
