package router_handler

import (
	"context"
	"net/http"

	gmux "github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"

	tokens "token-service/internal/tokens"
)

func GetHandlers(ctx *context.Context, redisClient *redis.Client) *gmux.Router {
	mux := gmux.NewRouter()

	mux.HandleFunc("/create-token", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			tokens.CreateToken(w, r, ctx, redisClient)
		}
	})

	mux.HandleFunc("/validate-token", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			tokens.ValidateToken(w, r, ctx, redisClient)
		}
	})

	mux.HandleFunc("/refresh-token", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			tokens.RefreshToken(w, r, ctx, redisClient)
		}
	})
	return mux
}
