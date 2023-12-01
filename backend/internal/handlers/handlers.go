package handlers

import (
	"backend/internal/authorization"
	"encoding/json"
	"net/http"
	"sync"

	"github.com/alicebob/miniredis/v2"
	gmux "github.com/gorilla/mux"

	"backend/internal/announcement"
	"backend/internal/review"
	"backend/internal/user"
)

func GetHandlers(redis *miniredis.Miniredis) *gmux.Router {
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
	})
	mux.HandleFunc("/announcement", func(w http.ResponseWriter, r *http.Request) {
		sLock := sync.Mutex{}
		switch r.Method {
		case http.MethodGet:
			sLock.Lock()
			announcement.GetAnnouncements(w, r)
			sLock.Unlock()
		case http.MethodPost:
			sLock.Lock()
			announcement.PostAnnouncement(w, r)
			sLock.Unlock()
		case http.MethodDelete:
			sLock.Lock()
			announcement.DeleteAnnouncement(w, r)
			sLock.Unlock()
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/review", func(w http.ResponseWriter, r *http.Request) {
		sLock := sync.Mutex{}
		switch r.Method {
		case http.MethodGet:
			sLock.Lock()
			review.Get(w, r)
			sLock.Unlock()
		case http.MethodPost:
			sLock.Lock()
			review.Post(w, r)
			sLock.Unlock()
		case http.MethodDelete:
			sLock.Lock()
			review.Delete(w, r)
			sLock.Unlock()
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
	})
	mux.HandleFunc("/refresh", func(writer http.ResponseWriter, request *http.Request) {
		switch request.Method {
		case http.MethodPut:
			authorization.Refresh(writer, request, redis)
		default:
			writer.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/user", func(writer http.ResponseWriter, request *http.Request) {
		switch request.Method {
		case http.MethodGet:
			user.Get(writer, request)
		case http.MethodPost:
			user.Post(writer, request)

		}
	})
	return mux
}
