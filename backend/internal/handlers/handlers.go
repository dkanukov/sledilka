package handlers

import (
	"backend/internal/authorization"
	"backend/internal/handlers/announcement"
	"backend/internal/handlers/devices"
	"backend/internal/handlers/images"
	"backend/internal/handlers/layer"
	"backend/internal/handlers/object"
	"backend/internal/handlers/review"
	"backend/internal/handlers/user"
	"backend/internal/utils"
	"encoding/json"
	gmux "github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

func GetHandlers(db *gorm.DB) *gmux.Router {
	router := gmux.NewRouter()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
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

	router.HandleFunc("/announcement", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			announcement.Get(w, r, db)
		case http.MethodPost:
			announcement.Post(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodGet, http.MethodPost)

	router.HandleFunc("/announcement/{id}", authorization.JwtAuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			announcement.GetById(w, r, db)
		case http.MethodDelete:
			announcement.Delete(w, r, db)
		case http.MethodPatch:
			announcement.Patch(w, r, db)
		case http.MethodPut:
			announcement.Put(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})).Methods(http.MethodGet, http.MethodDelete, http.MethodPatch, http.MethodPut)

	router.HandleFunc("/review", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			review.Get(w, r, db)
		case http.MethodPost:
			review.Post(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodPost, http.MethodGet)

	router.HandleFunc("/review/{id}", authorization.JwtAuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			review.GetById(w, r, db)
		case http.MethodPut:
			review.Put(w, r, db)
		case http.MethodDelete:
			review.Delete(w, r, db)
		case http.MethodPatch:
			review.Patch(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})).Methods(http.MethodGet, http.MethodDelete, http.MethodPatch, http.MethodPut)

	router.HandleFunc("/user", func(writer http.ResponseWriter, request *http.Request) {
		switch request.Method {
		case http.MethodGet:
			user.GetList(writer, request, db)
		case http.MethodPost:
			user.Post(writer, request, db)
		default:
			writer.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodGet, http.MethodPost)

	router.HandleFunc("/user/{id}", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			user.GetByID(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodGet)
	router.HandleFunc("/token", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			authorization.Token(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodPost)

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

	router.HandleFunc("/objects", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			object.Get(w, r, db)
		case http.MethodPost:
			object.Post(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodGet, http.MethodPost)

	router.HandleFunc("/objects/{id}", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			object.GetById(w, r, db)
		case http.MethodPatch:
			object.Patch(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodGet, http.MethodPatch)

	router.HandleFunc("/objects/{id}/layers", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			layer.Post(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodPost)

	router.HandleFunc("/objects/{object_id}/layers/{layer_id}", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPatch:
			layer.Patch(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodPatch)

	router.HandleFunc("/devices", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			devices.Post(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodPost)

	router.HandleFunc("/devices/{id}", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPatch:
			devices.Patch(w, r, db)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodPatch)

	router.HandleFunc("/new", func(w http.ResponseWriter, r *http.Request) {
		utils.NewEntities()
	}).Methods(http.MethodPost)
	//router.HandleFunc("/refresh", func(writer http.ResponseWriter, request *http.Request) {
	//	switch request.Method {
	//	case http.MethodPut:
	//		authorization.Refresh(writer, request)
	//	default:
	//		writer.WriteHeader(http.StatusMethodNotAllowed)
	//	}
	//})

	return router
}
