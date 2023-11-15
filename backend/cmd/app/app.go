package main

import (
	"backend/internal/handlers"
	"log"
	"net/http"
)

func main() {

	app := http.Server{
		Addr:    "0.0.0.0:8081",
		Handler: handlers.GetHandlers(),
	}
	log.Fatal(app.ListenAndServe())

}
