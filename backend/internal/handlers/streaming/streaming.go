package streaming

import (
	"backend/config"
	"backend/internal/entity"
	"backend/internal/errors"
	"fmt"
	"github.com/google/uuid"
	gmux "github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

// @Summary	получить трансляцию
// @Tags		stream
// @Accept		json
// @Produce	json
// @Param		id path string true "Device ID"
// @Failure	500
// @Router		/stream/{id} [get]
func Get(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
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
	http.Redirect(w, r, fmt.Sprintf(config.StreamingURLFmt, device.IpAddress), http.StatusSeeOther)
}
