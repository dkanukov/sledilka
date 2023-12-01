package utils

import (
	"backend/internal/entity"
)

const TOKEN_LEN = 32

func NewId[T entity.WithID](arr []T) int64 {
	if len(arr) == 0 {
		return 1
	}
	maxID := int64(0)
	for i := range arr {
		maxID = max(arr[i].ID(), maxID)
	}
	return maxID + 1
}

func IndexOfID[T entity.WithID](id int64, data []T) int {
	for k, v := range data {
		if id == v.ID() {
			return k
		}
	}
	return -1 // not found.
}
