package main

import (
	"context"
	"log"
	"net/http"

	"github.com/redis/go-redis/v9"
	"github.com/rs/cors"

	"token-service/internal/router_handler"
)

const (
	serverAddr = "0.0.0.0:8082"
	redisAddr  = "redis:6379"
)

func main() {
	ctx := context.Background()

	redisClient := redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: "",
		DB:       0,
	})

	err := redisClient.Ping(ctx).Err()
	if err != nil {
		log.Println(err)
		log.Fatal("Can't connect to redis client")
	}

	router := router_handler.GetHandlers(&ctx, redisClient)

	cors := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{
			http.MethodPost,
			http.MethodGet,
		},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: false,
	})

	app := http.Server{
		Addr:    serverAddr,
		Handler: cors.Handler(router),
	}

	log.Fatal(app.ListenAndServe())
}
