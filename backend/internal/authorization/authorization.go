package authorization

import (
	"backend/internal/entity"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"github.com/alicebob/miniredis/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
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

//func VerifyUser(token string) (int64, bool) {
//	if !r.Exists(token) {
//		return 0, false
//	}
//	strId, err := r.Get(token)
//	if err != nil {
//		log.Println(err)
//		return 0, false
//	}
//	id, _ := strconv.Atoi(strId)
//	return int64(id)
//}

func Auth(username string, password string, db *gorm.DB) (UserID int64, ok bool) {
	user := entity.User{}

	if res := db.Where(&entity.User{Username: username}).First(&user); res.RowsAffected == 0 {
		return 0, false
	}

	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)) == nil {
		return user.Id, true
	}
	return user.Id, false
}

//func JwtAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
//	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
//		authToken := r.Header.Get("X-Auth-Token")
//		if len(authToken) == 0 {
//			w.WriteHeader(http.StatusUnauthorized)
//			return
//		}
//		userID, authorized := VerifyUser(authToken)
//		if !authorized {
//			w.WriteHeader(http.StatusUnauthorized)
//			return
//		}
//		context.Set(r, "x-user-id", userID)
//		next(w, r)
//	}
//}

// @Summary	Авторизоваться
// @Tags		token
// @Accept		mpfd
// @Produce	json
// @Param		request	body	entity.LoginInfo	true	"Регистрационная информация"
// @Success	200		{object}	entity.UserToken
// @Failure	500
// @Router		/token [post]
//func Token(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
//	loginData, respErr := utils.ValidateBody[entity.LoginInfo](r)
//	if respErr!=nil {
//		respErr.WriteResponse(w)
//		return
//	}
//	userId, ok := Auth(loginData.Username, loginData.Password, db)
//	if !ok {
//		w.WriteHeader(http.StatusUnauthorized)
//		return
//	}
//	if userId == 0 {
//		w.WriteHeader(http.StatusNotFound)
//		return
//	}
//	token := createToken(redis, userId)
//	b, _ = json.Marshal(entity.UserToken{Token: token, ExpiresIn: int64(time.Hour.Seconds())})
//	w.Write(b)
//}

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
