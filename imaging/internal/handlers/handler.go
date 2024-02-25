package handlers

import (
	"net/http"
)

func New() *http.ServeMux {
	router := http.NewServeMux()

	router.HandleFunc("/", Luminance)
	return router
}
