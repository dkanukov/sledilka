package user

import (
	"backend/internal/dbmodel"
	"backend/internal/entity"
)

func UserListToUserInfo(users []dbmodel.User) []entity.UserInfo {
	result := make([]entity.UserInfo, len(users))
	for i := range users {
		result[i].Id = users[i].ID
		result[i].Username = users[i].Username
		result[i].IsAdmin = users[i].IsAdmin
	}
	return result
}
