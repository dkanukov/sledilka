package sledilka

import (
	"backend/internal/handlers/images"
	"github.com/gorilla/mux"
	"net/http"
)

func (s *Sledilka) addImageHandler(router *mux.Router) {
	router.HandleFunc("/images", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			images.UploadFile(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodPost)

	router.HandleFunc("/images/{file}", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			images.Load(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodGet)
}
