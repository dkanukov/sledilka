package main

import (
	"log"
	"net/http"

	"github.com/alicebob/miniredis/v2"
	"github.com/rs/cors"

	"backend/internal/handlers"
)

func main() {
	r, err := miniredis.Run()
	if err != nil {
		log.Fatal(err)
	}
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
		Addr:    "0.0.0.0:8081",
		Handler: cors.Handler(handlers.GetHandlers(r)),
	}
	log.Fatal(app.ListenAndServe())
}
