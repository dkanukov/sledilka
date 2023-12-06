package review

import (
	"backend/internal/entity"
	"backend/internal/errors"
	"backend/internal/utils"
	"encoding/json"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"net/http"
)

// @Summary	Возвращает отзывы
// @Tags		reviews
// @Accept		json
// @Produce	json
// @Success	200	{object}	[]entity.Review
// @Failure	500
// @Router		/review [get]
func Get(w http.ResponseWriter, _ *http.Request, db *gorm.DB) {
	var reviews []entity.Review
	db.Find(&reviews)
	b, _ := json.Marshal(reviews)
	w.Write(b)
}

// @Summary	Создать отзыв
// @Tags		reviews
// @Accept		json
// @Produce	json
// @Param		request	body		entity.NewReview true "Новый отзыв"
// @Success	200		{object}	entity.Review
// @Failure	500
// @Router		/review [post]
func Post(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	newReq, err := utils.ValidateBody[entity.NewReview](r)
	if err != nil {
		err.WriteResponse(w)
	}
	review := entity.Review{Name: newReq.Name, Rating: newReq.Rating, Comment: newReq.Comment}
	if res := db.Create(&review); res.RowsAffected == 0 {
		w.WriteHeader(http.StatusInternalServerError)
	}
	b, _ := json.Marshal(review)
	w.Write(b)
}

// @Summary	Удалить отзыв
// @Tags		reviews
// @Accept		json
// @Produce	json
// @Param		id query uuid true "Review ID"
// @Success	200		{object}	string
// @Failure	500
// @Router		/review [delete]
func Delete(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	query := r.URL.Query()
	if !query.Has("id") {
		w.WriteHeader(http.StatusBadRequest)
	}
	id, err := uuid.FromBytes([]byte(query.Get("id")))
	if err != nil {
		errorMessage := errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errorMessage.WriteResponse(w)
		return
	}
	if res := db.Delete(&entity.Review{Id: id}); res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}
