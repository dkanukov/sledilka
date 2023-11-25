package main

import (
	"backend/internal/handlers"
	"github.com/alicebob/miniredis/v2"
	"log"
	"net/http"
)

func main() {
	r, err := miniredis.Run()
	if err != nil {
		log.Fatal(err)
	}
	app := http.Server{
		Addr:    "0.0.0.0:8081",
		Handler: handlers.GetHandlers(r),
	}
	log.Fatal(app.ListenAndServe())

}
