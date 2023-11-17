package entity

type WithID interface {
	ID() int64
}

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

func (an Announcement) ID() int64 {
	return an.Id
}

type NewReview struct {
	Name    string `json:"name"`
	Rating  int64  `json:"rating"`
	Comment string `json:"comment"`
}

type Review struct {
	Id        int64  `json:"id"`
	Name      string `json:"name"`
	Rating    int64  `json:"rating"`
	Comment   string `json:"comment"`
	CreatedAt int64  `json:"createdAt"`
}

func (r Review) ID() int64 {
	return r.Id
}
