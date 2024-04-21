package entity

import "github.com/google/uuid"

type UserInfoList []UserInfo

type UserInfo struct {
	Id       uuid.UUID `json:"id"`
	Username string    `json:"username"`
	IsAdmin  bool      `json:"is_admin"`
}

type NewUser struct {
	Username string `json:"username"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"is_admin"`
}

type LoginInfo struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
