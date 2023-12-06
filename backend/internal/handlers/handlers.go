package handlers

import (
	"backend/internal/announcement"
	"backend/internal/authorization"
	"backend/internal/review"
	"backend/internal/user"
	"encoding/json"
	"github.com/alicebob/miniredis/v2"
	gmux "github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func GetHandlers(redis *miniredis.Miniredis, db *gorm.DB) *gmux.Router {
	mux := gmux.NewRouter()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			b, err := json.Marshal("Hello world")
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			_, _ = w.Write(b)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodGet)
	mux.HandleFunc("/announcement", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			announcement.Get(w, r, db)
		case http.MethodPost:
			announcement.Post(w, r, db)
		case http.MethodDelete:
			announcement.Delete(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodGet, http.MethodPost, http.MethodDelete)
	mux.HandleFunc("/review", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			review.Get(w, r, db)
		case http.MethodPost:
			review.Post(w, r, db)
		case http.MethodDelete:
			review.Delete(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/token", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			authorization.Token(w, r, redis)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodPost)

	mux.HandleFunc("/refresh", func(writer http.ResponseWriter, request *http.Request) {
		switch request.Method {
		case http.MethodPut:
			authorization.Refresh(writer, request, redis)
		default:
			writer.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/user", func(writer http.ResponseWriter, request *http.Request) {
		query := request.URL.Query()
		switch request.Method {
		case http.MethodGet:
			if query.Has("id") {
				id, err := strconv.Atoi(query.Get("id"))
				if err != nil {
					writer.WriteHeader(http.StatusBadRequest)
					return
				}
				user.GetByID(writer, request, db, int64(id))
			} else {
				user.GetList(writer, request, db)
			}
		case http.MethodPost:
			user.Post(writer, request, db)
		}
	}).Methods(http.MethodGet, http.MethodPost)
	return mux
}
