package validate

import (
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"net/http"
)

func UUID(r *http.Request) (uuid.UUID, error) {
	return uuid.Parse(mux.Vars(r)["id"])
}
