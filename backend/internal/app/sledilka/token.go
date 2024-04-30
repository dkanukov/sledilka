package sledilka

import (
	"backend/internal/authorization"
	"github.com/gorilla/mux"
	"net/http"
)

func (s *Sledilka) addTokenHandler(router *mux.Router) {
	router.HandleFunc("/token", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			authorization.Token(w, r, s.q, s.tokener)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodPost)

	router.HandleFunc("/refresh", func(writer http.ResponseWriter, request *http.Request) {
		switch request.Method {
		case http.MethodPost:
			authorization.Refresh(writer, request, s.tokener)
		default:
			writer.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodPost)
}
