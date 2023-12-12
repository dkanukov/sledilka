package token

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/redis/go-redis/v9"
)

type TokenRequest struct {
	UserId int `json:"user_id"`
}

type CreateTokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

const (
	JwtSecretKey = "super-secret-key"
)

func Create(
	w http.ResponseWriter,
	r *http.Request,
	ctx *context.Context,
	redisClient *redis.Client,
) {
	var requestBody TokenRequest
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.StandardClaims{
		ExpiresAt: TokenLiveTimeShort,
		IssuedAt:  time.Now().Unix(),
		Id:        strconv.Itoa(requestBody.UserId),
	})

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.StandardClaims{
		ExpiresAt: TokenLiveTimeLong,
		IssuedAt:  time.Now().Unix(),
		Id:        strconv.Itoa(requestBody.UserId),
	})

	signedAccessToken, err := accessToken.SignedString([]byte(JwtSecretKey))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	signedRefreshToken, err := refreshToken.SignedString([]byte(JwtSecretKey))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response, err := json.Marshal(&CreateTokenResponse{
		AccessToken:  signedAccessToken,
		RefreshToken: signedRefreshToken,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	redisErr := redisClient.SetEx(*ctx, signedAccessToken, strconv.Itoa(requestBody.UserId), 10*time.Minute).
		Err()
	if redisErr != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	redisErr = redisClient.SetEx(*ctx, strconv.Itoa(requestBody.UserId), signedAccessToken, 10*time.Minute).
		Err()
	if redisErr != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	redisErr = redisClient.SetEx(*ctx, signedRefreshToken, strconv.Itoa(requestBody.UserId), 12*time.Hour).
		Err()
	if redisErr != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}
