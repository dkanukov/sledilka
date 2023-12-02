package authorization

import (
	"backend/internal/entity"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"github.com/alicebob/miniredis/v2"
	"golang.org/x/crypto/bcrypt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

const TokenLen = 32

func generateSecureToken(length int) string {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return hex.EncodeToString(b)
}

func refreshToken(r *miniredis.Miniredis, token string) (ok bool) {
	if !r.Exists(token) {
		return false
	}
	r.SetTTL(token, 1*time.Hour)
	return true
}

func createToken(r *miniredis.Miniredis, UserId int64) string {
	newToken := generateSecureToken(TokenLen)
	for exists := r.Exists(newToken); exists; exists = r.Exists(newToken) {
		newToken = generateSecureToken(TokenLen)
	}

	r.Set(newToken, strconv.Itoa(int(UserId)))
	r.SetTTL(newToken, time.Hour)
	return newToken
}

func VerifyUser(token string, r *miniredis.Miniredis) int64 {
	if !r.Exists(token) {
		return -1
	}
	strId, err := r.Get(token)
	if err != nil {
		log.Println(err)
		return -1
	}
	id, _ := strconv.Atoi(strId)
	return int64(id)
}

func Auth(username string, password string, users []entity.User) (UserID int64, ok bool) {
	for _, user := range users {
		if user.Username == username &&
			bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)) == nil {
			return user.Id, true
		}
	}
	return -1, false
}

// @Summary	Авторизоваться
// @Tags		token
// @Accept		mpfd
// @Produce	json
// @Param username formData string true "username"
// @Param password formData string true "password"
// @Success	200		{object}	entity.UserToken
// @Failure	500
// @Router		/token [post]
func Token(w http.ResponseWriter, r *http.Request, redis *miniredis.Miniredis) {
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
	userId, ok := Auth(username, password, users)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	token := createToken(redis, userId)
	b, _ = json.Marshal(entity.UserToken{Token: token, ExpiresIn: int64(time.Hour.Seconds())})
	w.Write(b)
}

// @Summary	Обновить токен
// @Tags		token
// @Accept		mpfd
// @Produce	json
// @Param token query string true "token"
// @Success	200		{object}	entity.UserToken
// @Failure	500
// @Router		/refresh [post]
func Refresh(writer http.ResponseWriter, request *http.Request, redis *miniredis.Miniredis) {
	query := request.URL.Query()
	if !query.Has("token") {
		writer.WriteHeader(http.StatusUnauthorized)
		return
	}
	token := query.Get("token")
	if ok := refreshToken(redis, token); !ok {
		writer.WriteHeader(http.StatusUnauthorized)
		return
	}
	b, _ := json.Marshal(entity.UserToken{Token: token, ExpiresIn: int64(time.Hour.Seconds())})
	writer.Write(b)
}
