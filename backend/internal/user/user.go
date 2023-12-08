package user

import (
	"backend/internal/entity"
	"backend/internal/errors"
	"backend/internal/utils"
	"encoding/json"
	gmux "github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

// @Summary	Получить информацию о пользователе по id
// @Tags		user
// @Produce	json
// @Param id path int true "user id"
// @Success	200		{object}	entity.UserInfo
// @Failure	500
// @Router		/user/{id} [get]
func GetByID(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	var idParam = gmux.Vars(r)["id"]
	id, err := strconv.Atoi(idParam)
	if err != nil {
		requestErr := errors.ResponseError{StatusCode: http.StatusBadRequest, Message: err.Error()}
		requestErr.WriteResponse(w)
		return
	}
	var user = entity.User{Id: int64(id)}
	res := db.Find(&user)
	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	b, _ := json.Marshal(entity.UserInfo{Id: user.Id, Username: user.Username})
	w.Write(b)
}

// @Summary	Получить список пользователей
// @Tags		user
// @Produce	json
// @Success	200		{object}	entity.UserInfoList
// @Failure	500
// @Router		/user [get]
func GetList(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	var users []entity.User
	db.Find(&users)
	result := userListToUserInfo(users)
	b, _ := json.Marshal(result)
	w.Write(b)
}

func userListToUserInfo(users []entity.User) []entity.UserInfo {
	result := make([]entity.UserInfo, len(users))
	for i := range users {
		result[i].Id = users[i].Id
		result[i].Username = users[i].Username
	}
	return result
}

// @Summary	Зарегистрировать
// @Tags		user
// @Accept		json
// @Produce	json
// @Param		request	body	entity.NewUser	true	"Регистрационная информация"
// @Success	200		{object}	entity.UserInfo
// @Failure	500
// @Router		/user [post]
func Post(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	newUser, err := utils.ValidateBody[entity.NewUser](r)
	if err != nil {
		err.WriteResponse(w)
		return
	}
	hashedPassword, er := bcrypt.GenerateFromPassword([]byte(newUser.Password), 12)
	if er != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	user := entity.User{Username: newUser.Username, PasswordHash: string(hashedPassword)}
	res := db.Create(&user)
	if res.Error != nil {
		w.WriteHeader(http.StatusBadRequest)
		err = &errors.ResponseError{
			StatusCode: http.StatusBadRequest,
			Message:    res.Error.Error(),
		}
		err.WriteResponse(w)
		return
	}
	b, _ := json.Marshal(entity.UserInfo{Id: user.Id, Username: user.Username})
	w.Write(b)
}
