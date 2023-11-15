package handlers

import (
	"backend/internal/entity"
	"encoding/json"
	gmux "github.com/gorilla/mux"
	"io"
	"net/http"
	"os"
	"sync"
	"time"
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
			file, err := os.OpenFile("fake_db.json", os.O_RDONLY|os.O_CREATE, 777)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			b, err := io.ReadAll(file)
			file.Close()
			sLock.Unlock()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			_, _ = w.Write(b)
		case http.MethodPost:
			sLock.Lock()

			file, err := os.Open("fake_db.json")
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			b, err := io.ReadAll(file)
			file.Close()
			var announcements []entity.Announcement
			if err = json.Unmarshal(b, &announcements); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			b, err = io.ReadAll(r.Body)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			reqData := entity.NewAnnouncement{}
			err = json.Unmarshal(b, &reqData)
			newAnnounc := entity.Announcement{
				Title:       reqData.Title,
				Description: reqData.Description,
			}
			newAnnounc.CreatedAt = time.Now().Unix()
			newAnnounc.Id = int64(len(announcements))
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte(err.Error()))
				return
			}
			announcements = append(announcements, newAnnounc)
			b, err = json.Marshal(newAnnounc)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			w.Write(b)
			b, err = json.Marshal(announcements)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			os.WriteFile("fake_db.json", b, 0644)
			sLock.Unlock()
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	return mux
}
