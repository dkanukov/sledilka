package authorization

import (
	"backend/internal/entity"
	"backend/internal/tokener"
	"backend/internal/utils"
	"encoding/json"
	"fmt"
	"github.com/gorilla/context"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
)

func Auth(username string, password string, db *gorm.DB) (UserID int64, ok bool) {
	user := entity.User{}

	if res := db.Where(&entity.User{Username: username}).First(&user); res.RowsAffected == 0 {
		return 0, false
	}

	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)) != nil {
		return user.Id, false
	}
	return user.Id, true
}

func JwtAuthMiddleware(next http.HandlerFunc, client tokener.TokenerClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authToken := r.Header.Get("X-Auth-Token")
		if len(authToken) == 0 {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		userID, err := client.ValidateToken(r.Context(), &tokener.ValidateTokenRequest{AccessToken: authToken})
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		context.Set(r, "x-user-id", userID.GetUserId())
		next(w, r)
	}
}

// @Summary	Авторизоваться
// @Tags		token
// @Accept		json
// @Produce	json
// @Param		request	body	entity.LoginInfo	true	"Регистрационная информация"
// @Success	200		{object}	tokener.CreateTokenResponse
// @Failure	500
// @Router		/token [post]
func Token(w http.ResponseWriter, r *http.Request, db *gorm.DB, client tokener.TokenerClient) {
	loginData, respErr := utils.ValidateBody[entity.LoginInfo](r)
	if respErr != nil {
		respErr.WriteResponse(w)
		return
	}
	userId, ok := Auth(loginData.Username, loginData.Password, db)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if userId == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	token, err := client.CreateToken(r.Context(), &tokener.CreateTokenRequest{UserId: fmt.Sprint(userId)})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(fmt.Append(nil, err))
		return
	}
	b, _ := json.Marshal(token)
	w.Write(b)
}

// @Summary	Обновить токен
// @Tags		token
// @Accept		mpfd
// @Produce	json
// @Param token query string true "token"
// @Success	200		{object}	tokener.RefreshTokenResponse
// @Failure	500
// @Router		/refresh [post]
func Refresh(writer http.ResponseWriter, request *http.Request, client tokener.TokenerClient) {
	token := request.Header.Get("X-Auth-Token")
	if token == "" {
		writer.WriteHeader(http.StatusUnauthorized)
		return
	}
	newToken, err := client.RefreshToken(request.Context(), &tokener.RefreshTokenRequest{RefreshToken: token})
	if err != nil {
		writer.WriteHeader(http.StatusUnauthorized)
		writer.Write(fmt.Append(nil, err))
		return
	}
	b, _ := json.Marshal(newToken)
	writer.Write(b)
}
