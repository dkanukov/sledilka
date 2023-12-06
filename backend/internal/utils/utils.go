package utils

import (
	"backend/internal/errors"
	"encoding/json"
	"io"
	"net/http"
)

func ValidateBody[T any](r *http.Request) (T, *errors.ResponseError) {
	b, err := io.ReadAll(r.Body)
	var newObj T
	if err != nil {
		return newObj, &errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
	}
	if err = json.Unmarshal(b, &newObj); err != nil {
		return newObj, &errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
	}
	return newObj, nil
}
