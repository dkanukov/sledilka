package main

import (
	"log"
	"net/http"

	"github.com/rs/cors"

	handlers "geosearch/internal"
)

func main() {
	corsOpt := cors.AllowAll()
	router := handlers.GetHandlers()

	app := http.Server{
		Addr:    "0.0.0.0:8083",
		Handler: corsOpt.Handler(router),
	}

	log.Fatal(app.ListenAndServe())
}
