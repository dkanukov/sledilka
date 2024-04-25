package handlers

import (
	"net/http"

	gmux "github.com/gorilla/mux"

	"geosearch/internal/geosearch"
)

func GetHandlers() *gmux.Router {
	router := gmux.NewRouter()

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			geosearch.Get(w, r)
		} else {
			http.Error(w, "no such method", http.StatusMethodNotAllowed)
		}
	})

	return router
}
