package backend

import (
	"backend/internal/entity"
	"backend/internal/utils"
	"testing"
)

func TestNewIDWithEmpty(t *testing.T) {
	emptyListReviews := []entity.Review{}
	newId := utils.NewId(emptyListReviews)
	if newId != 1 {
		t.Error("Wrong new Id", newId)
	}
}
func TestNewID(t *testing.T) {
	emptyListReviews := []entity.Review{entity.Review{Id: 1}, entity.Review{Id: 2}}
	newId := utils.NewId(emptyListReviews)
	if newId != 3 {
		t.Error("Wrong new Id", newId)
	}
}
