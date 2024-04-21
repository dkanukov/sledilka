package luminance

import (
	"backend/internal/dbmodel"
	"backend/internal/validate"
	"database/sql"
	"errors"
	"fmt"
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
func IsLowLighted(w http.ResponseWriter, r *http.Request, q *dbmodel.Queries) {
	id, err := validate.UUID(r)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		return
	}
	info, err := q.GetCameraInfoByDeviceId(r.Context(), id)
	switch {
	case errors.Is(err, sql.ErrNoRows) || info == nil:
		w.WriteHeader(http.StatusNotFound)
		return
	case err != nil:
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		return
	}
	resp, err := http.Get(fmt.Sprintf("http://0.0.0.0:8181/isLowLight/?url=%v", *info))
	if err != nil {
		if resp != nil {
			w.WriteHeader(resp.StatusCode)
		}
		log.Println(err)
		return
	}
	io.Copy(w, resp.Body)
}
