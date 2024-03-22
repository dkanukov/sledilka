package luminance

import (
	"backend/internal/entity"
	"backend/internal/errors"
	"fmt"
	"github.com/google/uuid"
	gmux "github.com/gorilla/mux"
	"gorm.io/gorm"
	"io"
	"log"
	"net/http"
)

// @Summary	получить трансляцию
// @Tags		isLowLight
// @Produce	json
// @Param		id path string true "Device ID"
// @Failure	500
// @Success	200		{object}	bool
// @Router		/isLowLight/{id} [get]
func IsLowLighted(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	idParam := gmux.Vars(r)["id"]
	id, err := uuid.Parse(idParam)
	if err != nil {
		errorMessage := errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		errorMessage.WriteResponse(w)
		return
	}
	device := entity.Device{Id: id}
	res := db.Find(&device)
	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	resp, err := http.Get(fmt.Sprintf("http://streaming-service:8181/isLowLight/?url=%v", device.IpAddress))
	if err != nil {
		w.WriteHeader(resp.StatusCode)
		log.Println(err)
		return
	}
	io.Copy(w, resp.Body)
}
