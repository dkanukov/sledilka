package entity

import "github.com/google/uuid"

type UserInfo struct {
	Id       int64  `json:"id"`
	Username string `json:"username"`
}

type UserInfoList []UserInfo

type User struct {
	Id           int64  `json:"user_id"`
	Username     string `json:"username"  gorm:"unique"`
	PasswordHash string `json:"password_hash"`
}

type NewUser struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginInfo struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type NewAnnouncement struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type Announcement struct {
	Id          uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4()"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   string    `json:"createdAt"`
}

type NewReview struct {
	Name    string `json:"name"`
	Rating  int64  `json:"rating"`
	Comment string `json:"comment"`
}

type Review struct {
	Id        uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4()"`
	Name      string    `json:"name"`
	Rating    int64     `json:"rating"`
	Comment   string    `json:"comment"`
	CreatedAt string    `json:"createdAt"`
}

type UserToken struct {
	Token     string `json:"token"`
	ExpiresIn int64  `json:"expires_in"`
}
