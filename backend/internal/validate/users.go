package validate

import (
	"backend/internal/dbmodel"
	"backend/internal/entity"
	"backend/internal/utils"
	"net/http"
)

func CreateUser(r *http.Request) (dbmodel.CreateUserParams, error) {
	user, err := utils.ValidateBody[entity.NewUser](r.Body)
	if err != nil {
		return dbmodel.CreateUserParams{}, err
	}

	return dbmodel.CreateUserParams{
		Username:     user.Username,
		PasswordHash: user.Password,
		IsAdmin:      user.IsAdmin,
	}, nil
}
