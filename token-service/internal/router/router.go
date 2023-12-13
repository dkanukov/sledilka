package router

import (
	"context"
	"net/http"

	gmux "github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"

	"token-service/internal/token"
)

func GetHandlers(ctx *context.Context, redisClient *redis.Client) *gmux.Router {
	mux := gmux.NewRouter()

	mux.HandleFunc("/create-token", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			token.Create(w, r, ctx, redisClient)
		default:
			w.WriteHeader(http.StatusForbidden)
		}
	})

	mux.HandleFunc("/validate-token", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			token.Validate(w, r, ctx, redisClient)
		}
	})

	mux.HandleFunc("/refresh-token", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			token.Refresh(w, r, ctx, redisClient)
		}
	})
	return mux
}
