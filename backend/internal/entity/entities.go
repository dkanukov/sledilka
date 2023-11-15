package entity

type NewMessage struct {
	Message string `json:"message"`
}

type NewAnnouncement struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type Announcement struct {
	Id          int64  `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	CreatedAt   int64  `json:"createdAt"`
}
