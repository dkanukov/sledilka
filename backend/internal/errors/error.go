package errors

import (
	"encoding/json"
	"net/http"
)

type ResponseError struct {
	StatusCode int
	Message    string
}

func (e *ResponseError) Error() string {
	b, _ := json.Marshal(*e)
	return string(b)
}

func (e *ResponseError) WriteResponse(w http.ResponseWriter) {
	w.WriteHeader(e.StatusCode)
	w.Write([]byte(e.Error()))
}
