package tokens

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/redis/go-redis/v9"
)

type RefreshTokenRequest struct {
	Token string `json:"token"`
}

type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
}

func RefreshToken(
	w http.ResponseWriter,
	r *http.Request,
	ctx *context.Context,
	redisClient *redis.Client,
) {
	w.Header().Set("Content-Type", "application/json")
	var requestBody RefreshTokenRequest

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userId, err := redisClient.Get(*ctx, requestBody.Token).Result()
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.StandardClaims{
		ExpiresAt: time.Now().Add(10 * time.Minute).Unix(),
		IssuedAt:  time.Now().Unix(),
		Id:        userId,
	})

	signedAccessToken, err := accessToken.SignedString([]byte(JwtSecretKey))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	oldAccessToken, err := redisClient.Get(*ctx, userId).Result()
	if err == nil {
		redisClient.Del(*ctx, userId)
		redisClient.Del(*ctx, oldAccessToken)
	}

	redisErr := redisClient.SetEx(*ctx, signedAccessToken, userId, 10*time.Minute).
		Err()
	if redisErr != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	redisErr = redisClient.SetEx(*ctx, userId, signedAccessToken, 10*time.Minute).
		Err()
	if redisErr != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response, err := json.Marshal(&RefreshTokenResponse{
		AccessToken: signedAccessToken,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Write(response)
}
