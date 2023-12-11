package token

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/redis/go-redis/v9"
)

type ValidateTokenRequest struct {
	Token string `json:"token"`
}

type ValidateTokenResponse struct {
	UserId string `json:"user_id"`
}

func Validate(
	w http.ResponseWriter,
	r *http.Request,
	ctx *context.Context,
	redisClient *redis.Client,
) {
	var requestBody ValidateTokenRequest

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token, err := redisClient.Get(*ctx, requestBody.Token).Result()
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	userId, err := redisClient.Get(*ctx, token).Result()
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
	}

	if token == requestBody.Token {
		response, err := json.Marshal(&ValidateTokenResponse{
			UserId: userId,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
		}

		w.Write(response)
		return
	}

	http.Error(w, "invalid token", http.StatusUnauthorized)
}
