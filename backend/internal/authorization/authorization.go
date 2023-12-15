package authorization

import (
	"backend/internal/entity"
	"backend/internal/utils"
	"bytes"
	"encoding/json"
	"github.com/gorilla/context"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"log"
	"net/http"
	"strconv"
	"time"
)

const (
	TokenServiceURL = "http://token-service:8082"
)

type ValidateTokenRequest struct {
	Token string `json:"token"`
}

type ValidateTokenResponse struct {
	UserId string `json:"user_id"`
}

type TokenRequest struct {
	UserId int `json:"user_id"`
}
type RefreshTokenRequest struct {
	Token string `json:"token"`
}

type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
}

type CreateTokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func refreshToken(token string) error {
	// TODO
	return nil
}

func createToken(UserId int64) (*CreateTokenResponse, error) {
	body := TokenRequest{UserId: int(UserId)}
	var buf bytes.Buffer
	err := json.NewEncoder(&buf).Encode(body)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	request, err := http.NewRequest(http.MethodPost, TokenServiceURL+"/create-token", &buf)
	client := &http.Client{}
	if err != nil {
		return nil, err
	}
	resp, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	var token CreateTokenResponse
	decoder := json.NewDecoder(resp.Body)
	err = decoder.Decode(&token)
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func VerifyUser(token string) (UserId int64, statusCode int) {
	body := ValidateTokenRequest{Token: token}
	var buf bytes.Buffer
	err := json.NewEncoder(&buf).Encode(body)
	if err != nil {
		log.Println(err)
		return 0, http.StatusInternalServerError
	}
	request, err := http.NewRequest(http.MethodPost, TokenServiceURL+"/create-token", &buf)
	client := &http.Client{}
	if err != nil {
		return 0, http.StatusInternalServerError
	}
	resp, err := client.Do(request)
	if err != nil {
		return 0, http.StatusInternalServerError
	}
	if resp.StatusCode != 200 {
		return 0, http.StatusUnauthorized
	}
	var val ValidateTokenResponse
	decoder := json.NewDecoder(resp.Body)
	err = decoder.Decode(&val)
	if err != nil {
		return 0, http.StatusInternalServerError
	}
	userId, _ := strconv.Atoi(val.UserId)
	return int64(userId), http.StatusOK
}

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

func JwtAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authToken := r.Header.Get("X-Auth-Token")
		if len(authToken) == 0 {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		userID, status := VerifyUser(authToken)
		if status != http.StatusOK {
			w.WriteHeader(status)
			return
		}
		context.Set(r, "x-user-id", userID)
		next(w, r)
	})
}

// @Summary	Авторизоваться
// @Tags		token
// @Accept		json
// @Produce	json
// @Param		request	body	entity.LoginInfo	true	"Регистрационная информация"
// @Success	200		{object}	CreateTokenResponse
// @Failure	500
// @Router		/token [post]
func Token(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
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
	token, err := createToken(userId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
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
// @Success	200		{object}	entity.UserToken
// @Failure	500
// @Router		/refresh [post]
func Refresh(writer http.ResponseWriter, request *http.Request) {
	token := request.Header.Get("X-Auth-Token")
	if token == "" {
		writer.WriteHeader(http.StatusUnauthorized)
		return
	}
	//if err := refreshToken(redis, token); !ok {
	//	writer.WriteHeader(http.StatusUnauthorized)
	//	return
	//}
	b, _ := json.Marshal(entity.UserToken{Token: token, ExpiresIn: int64(time.Hour.Seconds())})
	writer.Write(b)
}
