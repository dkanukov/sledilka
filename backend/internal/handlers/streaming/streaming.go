package streaming

import (
	"backend/internal/dbmodel"
	"backend/internal/validate"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"time"
)

// @Summary	получить трансляцию
// @Tags		stream
// @Accept		json
// @Produce	json
// @Param		id path string true "Device ID"
// @Failure	500
// @Router		/stream/{id} [get]
func Get(w http.ResponseWriter, r *http.Request, q *dbmodel.Queries, streamUrl string) {
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
	url, err := url.Parse(fmt.Sprintf(streamUrl+"?url=%s", *info))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		return
	}

	proxy := httputil.NewSingleHostReverseProxy(url)
	fmt.Printf("Request received at %s at %s\n", r.URL.String(), time.Now().UTC())
	// Update the headers to allow for SSL redirection
	r.URL = url
	r.Host = url.Host
	//trim reverseProxyRoutePrefix

	// Note that ServeHttp is non blocking and uses a go routine under the hood
	fmt.Printf("Redirecting request to %s at %s\n", r.URL.String(), time.Now().UTC())
	proxy.ServeHTTP(w, r)
}
