package tokens

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/redis/go-redis/v9"
)

type ValidateTokenRequest struct {
	Token string `json:"token"`
}

func ValidateToken(
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

	value, err := redisClient.Get(*ctx, requestBody.Token).Result()
	if err != nil {
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}

	if value == requestBody.Token {
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Error(w, "invalid token", http.StatusUnauthorized)
}
