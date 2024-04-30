package authorization

import (
	"backend/internal/dbmodel"
	"backend/internal/entity"
	"backend/internal/tokener"
	"backend/internal/utils"
	"context"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	gcontext "github.com/gorilla/context"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

func Auth(ctx context.Context, username string, password string, q *dbmodel.Queries) (UserID uuid.UUID, ok bool) {
	user, err := q.GetUserByUsername(ctx, username)
	if err != nil {
		return uuid.Nil, false
	}
	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)) != nil {
		return user.ID, false
	}
	return user.ID, true
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
		gcontext.Set(r, "x-user-id", userID.GetUserId())
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
func Token(w http.ResponseWriter, r *http.Request, q *dbmodel.Queries, client tokener.TokenerClient) {
	loginData, err := utils.ValidateBody[entity.LoginInfo](r.Body)
	if err != nil {
		fmt.Fprint(w, err)
		return
	}
	userId, ok := Auth(r.Context(), loginData.Username, loginData.Password, q)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if userId == uuid.Nil {
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
