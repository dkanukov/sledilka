package authorization

import (
	"backend/internal/entity"
	"backend/internal/utils"
	"crypto/rand"
	"encoding/hex"
	"github.com/alicebob/miniredis/v2"
	"golang.org/x/crypto/bcrypt"
	"log"
	"strconv"
	"time"
)

func GenerateSecureToken(length int) string {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return hex.EncodeToString(b)
}

func RefreshToken(r *miniredis.Miniredis, token string) (ok bool) {
	if !r.Exists(token) {
		return false
	}
	r.SetTTL(token, 1*time.Hour)
	return true
}

func CreateToken(r *miniredis.Miniredis, UserId int64) string {
	newToken := GenerateSecureToken(utils.TOKEN_LEN)
	for exists := r.Exists(newToken); exists; exists = r.Exists(newToken) {
		newToken = GenerateSecureToken(utils.TOKEN_LEN)
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
