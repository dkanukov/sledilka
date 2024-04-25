package handlers

import (
	"fmt"
	"net/http"

	gmux "github.com/gorilla/mux"
)

func GetHandlers() *gmux.Router {
	router := gmux.NewRouter()

	router.HandleFunc("/", func(responseWriter http.ResponseWriter, request *http.Request) {
		fmt.Println("test")
	})

	return router
}
