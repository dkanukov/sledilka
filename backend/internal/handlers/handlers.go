package handlers

import (
	"backend/internal/announcement"
	"backend/internal/entity"
	"backend/internal/review"
	"backend/internal/user"
	"backend/internal/utils"
	"encoding/json"
	"fmt"
	"github.com/alicebob/miniredis/v2"
	gmux "github.com/gorilla/mux"
	"io"
	"net/http"
	"os"
	"sync"
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
			file, err := os.Open("user.json")
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			b, err := io.ReadAll(file)
			file.Close()
			var users []entity.User
			if err = json.Unmarshal(b, &users); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			if err = r.ParseMultipartForm(512); err != nil {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			form := r.MultipartForm.Value
			arr, ok := form["username"]
			if !ok {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			username := arr[0]
			arr, ok = form["password"]
			if !ok {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			password := arr[0]
			userId, ok := utils.Auth(username, password, users)
			if !ok {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			token := utils.CreateToken(redis, userId)
			w.Write([]byte(fmt.Sprintf(`"token":"%s"`, token)))
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/refresh", func(writer http.ResponseWriter, request *http.Request) {
		switch request.Method {
		case http.MethodPut:
			query := request.URL.Query()
			if !query.Has("token") {
				writer.WriteHeader(http.StatusUnauthorized)
				return
			}
			token := query.Get("token")
			if ok := utils.RefreshToken(redis, token); !ok {
				writer.WriteHeader(http.StatusUnauthorized)
				return
			}
			writer.Write([]byte(`"refreshed": true`))
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
