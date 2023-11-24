package user

import (
	"backend/internal/entity"
	"backend/internal/utils"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"io"
	"net/http"
	"os"
	"strconv"
)

func Get(w http.ResponseWriter, r *http.Request) {
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
	if len(users) == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	query := r.URL.Query()
	if !query.Has("id") {
		_, _ = w.Write(b)
		return
	}
	id, err := strconv.Atoi(query.Get("id"))

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	ind := utils.IndexOfID(int64(id), users)
	if ind == -1 {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	response := entity.UserInfo{
		Id:       users[ind].Id,
		Username: users[ind].Username,
	}
	b, _ = json.Marshal(response)
	w.Write(b)
}

func Post(w http.ResponseWriter, r *http.Request) {
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
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	users = append(users,
		entity.User{
			Id:           utils.NewId(users),
			Username:     username,
			PasswordHash: string(hashedPassword),
		})
	response, _ := json.Marshal(entity.UserInfo{Id: users[len(users)-1].Id, Username: username})
	w.Write(response)
	b, err = json.Marshal(users)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	os.WriteFile("user.json", b, 0644)
}
