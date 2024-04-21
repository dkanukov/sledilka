package sledilka

import (
	"backend/internal/dbmodel"
	"backend/internal/entity"
	"backend/internal/handlers/user"
	"backend/internal/utils"
	"backend/internal/validate"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

func (s *Sledilka) addUserHandlers(router *mux.Router) {
	router.HandleFunc("/user", func(writer http.ResponseWriter, request *http.Request) {
		switch request.Method {
		case http.MethodGet:
			u, err := s.q.GetAllUsers(request.Context())
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				fmt.Fprint(writer, err)
				return
			}
			fmt.Fprint(writer, utils.MustJSON(user.UserListToUserInfo(u)))
		case http.MethodPost:
			u, code, err := createUser(request, s.q)
			if err != nil {
				writer.WriteHeader(code)
				fmt.Fprint(writer, err)
				return
			}
			fmt.Fprint(writer, utils.MustJSON(u))
		default:
			writer.WriteHeader(http.StatusMethodNotAllowed)
		}
	}).Methods(http.MethodGet, http.MethodPost)

	router.HandleFunc("/user/{id}", func(w http.ResponseWriter, r *http.Request) {
		u, code, err := findUser(r.Context(), s.q, mux.Vars(r)["id"])
		if err != nil {
			w.WriteHeader(code)
			fmt.Fprint(w, err)
			return
		}
		fmt.Fprint(w, utils.MustJSON(u))
	}).Methods(http.MethodGet)
}

// @Summary	Зарегистрировать
// @Tags		user
// @Accept		json
// @Produce	json
// @Param		request	body	entity.NewUser	true	"Регистрационная информация"
// @Success	200		{object}	entity.UserInfo
// @Failure	500
// @Router		/user [post]
func createUser(r *http.Request, q *dbmodel.Queries) (entity.UserInfo, int, error) {
	newUser, err := validate.CreateUser(r)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.PasswordHash), 12)
	if err != nil {
		return entity.UserInfo{}, http.StatusInternalServerError, err
	}
	newUser.PasswordHash = string(hashedPassword)
	u, err := q.CreateUser(r.Context(), newUser)
	if err != nil {
		return entity.UserInfo{}, http.StatusBadRequest, err
	}
	return entity.UserInfo{
		Id:       u.ID,
		Username: u.Username,
		IsAdmin:  u.IsAdmin,
	}, 200, nil
}

// @Summary	Получить информацию о пользователе по id
// @Tags		user
// @Produce	json
// @Param id path int true "user id"
// @Success	200		{object}	entity.UserInfo
// @Failure	500
// @Router		/user/{id} [get]
func findUser(ctx context.Context, q *dbmodel.Queries, id string) (entity.UserInfo, int, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return entity.UserInfo{}, http.StatusBadRequest, err
	}
	user, err := q.GetUserById(ctx, uid)
	switch {
	case errors.Is(err, sql.ErrNoRows):
		return entity.UserInfo{}, http.StatusNotFound, err
	case err != nil:
		return entity.UserInfo{}, http.StatusInternalServerError, err
	}
	return entity.UserInfo{
		Id:       user.ID,
		Username: user.Username,
		IsAdmin:  user.IsAdmin,
	}, 200, nil

}

// @Summary	Получить список пользователей
// @Tags		user
// @Produce	json
// @Success	200		{object}	entity.UserInfoList
// @Failure	500
// @Router		/user [get]
func findAll() {
	//заглушкаа для свагерра
}
