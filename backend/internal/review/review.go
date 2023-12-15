package review

import (
	"backend/internal/entity"
	"backend/internal/errors"
	"backend/internal/utils"
	"encoding/json"
	"github.com/google/uuid"
	gmux "github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

// @Summary	Возвращает все отзывы
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
// @Param		id path string true "Review ID"
// @Success	200
// @Security ApiKeyAuth
// @Failure	500
// @Router		/review/{id} [delete]
func Delete(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	id, err := uuid.Parse(idParam)
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

// @Summary	Изменить отзыв
// @Tags		reviews
// @Accept		json
// @Produce	json
// @Param		request	body	entity.NewReview	true	"Измененный отзыв"
// @Param		id path string true "Review ID"
// @Success	200	{object}	entity.Review
// @Security ApiKeyAuth
// @Failure	500
// @Router		/review/{id} [put]
func Put(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	id, err := uuid.Parse(idParam)
	if err != nil {
		errorMessage := errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errorMessage.WriteResponse(w)
		return
	}
	putReview, errResp := utils.ValidateBody[entity.NewReview](r)
	if errResp != nil {
		errResp.WriteResponse(w)
		return
	}
	review := entity.Review{Id: id}
	res := db.Find(&review)
	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	review.Name = putReview.Name
	review.Comment = putReview.Comment
	review.Rating = putReview.Rating
	db.Save(&review)
	b, _ := json.Marshal(review)
	w.Write(b)
}

// @Summary	Изменить отзыв
// @Tags		reviews
// @Accept		json
// @Produce	json
// @Param		request	body	entity.NewReview	true	"Измененный отзыв"
// @Param		id path string true "Review ID"
// @Success	200	{object}	entity.Review
// @Failure	500
// @Security ApiKeyAuth
// @Router		/review/{id} [patch]
func Patch(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	id, err := uuid.Parse(idParam)
	if err != nil {
		errorMessage := errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errorMessage.WriteResponse(w)
		return
	}
	review := entity.Review{Id: id}
	res := db.Find(&review)
	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	if err = json.NewDecoder(r.Body).Decode(&review); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	db.Save(&review)
	json.NewEncoder(w).Encode(&review)
}

// @Summary	Отзыв по id
// @Tags		reviews
// @Accept		json
// @Produce	json
// @Success	200	{object}	entity.Review
// @Failure	500
// @Router		/review/{id} [get]
// @Security ApiKeyAuth
// @Param		id	path  string	true	"uuid"
func GetById(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	uuidId, err := uuid.Parse(idParam)
	if err != nil {
		errResp := &errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errResp.WriteResponse(w)
		return
	}
	review := entity.Review{Id: uuidId}
	res := db.Find(&review)
	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	b, _ := json.Marshal(review)
	w.Write(b)
}
