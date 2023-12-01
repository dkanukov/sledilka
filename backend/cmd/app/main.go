package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/alicebob/miniredis/v2"
	"github.com/rs/cors"
	httpSwagger "github.com/swaggo/http-swagger"

	_ "backend/docs"
	"backend/internal/handlers"
)

//	@title			Sledilka API
//	@version		1.0
//	@description	API for Sledilka service
//	@termsOfService	http://swagger.io/terms/

// @host	localhost:8081
func main() {
	r, err := miniredis.Run()
	if err != nil {
		log.Fatal(err)
	}
	router := handlers.GetHandlers(r)
	router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)
	router.HandleFunc("/swagger", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/swagger/", http.StatusSeeOther)
	})

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
		Handler: cors.Handler(router),
	}

	fmt.Println("swagger")

	log.Fatal(app.ListenAndServe())
}
