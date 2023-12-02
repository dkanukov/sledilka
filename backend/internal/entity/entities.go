package entity

import "github.com/google/uuid"

type WithID interface {
	ID() uuid.UUID
}

type UserInfo struct {
	Id       int64  `json:"id"`
	Username string `json:"username"`
}

type User struct {
	Id           int64  `json:"id"`
	Username     string `json:"username"`
	PasswordHash string `json:"password_hash"`
}

func (u User) ID() int64 {
	return u.Id
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

func (an Announcement) ID() uuid.UUID {
	return an.Id
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

func (r Review) ID() uuid.UUID {
	return r.Id
}
