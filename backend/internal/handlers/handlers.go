package handlers

import (
	"backend/internal/announcement"
	"backend/internal/entity"
	"backend/internal/review"
	"encoding/json"
	gmux "github.com/gorilla/mux"
	"io"
	"net/http"
	"sync"
)

func GetHandlers() *gmux.Router {
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
		case http.MethodPost:
			message := entity.NewMessage{}
			b, err := io.ReadAll(r.Body)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			err = json.Unmarshal(b, &message)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			_, _ = w.Write(b)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/denis", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			b, err := json.Marshal("Pidor")
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			w.Write(b)
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
			review.GetReviews(w, r)
			sLock.Unlock()
		case http.MethodPost:
			sLock.Lock()
			review.PostReview(w, r)
			sLock.Unlock()
		case http.MethodDelete:
			sLock.Lock()
			review.DeleteReview(w, r)
			sLock.Unlock()
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	return mux
}
