package announcement

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"

	"backend/internal/entity"
	"backend/internal/utils"
)

// GetAnnouncements
//	@ID			asdf
//	@Summary	Возвращает анонсы
//	@Tags		announcements
//	@Accept		json
//	@Produce	json
//	@Success	200	{object}	[]entity.Announcement
//	@Failure	500
//	@Router		/announcement [get]
func GetAnnouncements(w http.ResponseWriter, _ *http.Request) {
	file, err := os.OpenFile("announcement.json", os.O_RDONLY|os.O_CREATE, 777)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	b, err := io.ReadAll(file)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	file.Close()
	_, _ = w.Write(b)
}

// CreateAnnouncement
//	@Summary	Возвращает анонсы
//	@Tags		announcements
//	@Accept		json
//	@Produce	json
//	@Success	200	{object}	[]entity.Announcement
//	@Failure	500
//	@Router		/announcement [get]
func PostAnnouncement(w http.ResponseWriter, r *http.Request) {
	file, err := os.Open("announcement.json")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	b, err := io.ReadAll(file)
	file.Close()
	var announcements []entity.Announcement
	if err = json.Unmarshal(b, &announcements); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	b, err = io.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	reqData := entity.NewAnnouncement{}
	err = json.Unmarshal(b, &reqData)
	newAnnounc := entity.Announcement{
		Title:       reqData.Title,
		Description: reqData.Description,
		CreatedAt:   time.Now().Unix(),
		Id:          utils.NewId(announcements),
	}
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	announcements = append(announcements, newAnnounc)
	b, err = json.Marshal(newAnnounc)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(b)
	b, err = json.Marshal(announcements)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	os.WriteFile("announcement.json", b, 0644)
}

func DeleteAnnouncement(w http.ResponseWriter, r *http.Request) {
	file, err := os.Open("announcement.json")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	b, err := io.ReadAll(file)
	file.Close()
	var announcements []entity.Announcement
	if err = json.Unmarshal(b, &announcements); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	query := r.URL.Query()
	id, err := strconv.Atoi(query.Get("id"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	index := utils.IndexOfID(int64(id), announcements)
	if index == -1 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	announcements[index] = announcements[len(announcements)-1]
	announcements[len(announcements)-1] = entity.Announcement{}
	announcements = announcements[:len(announcements)-1]
	b, err = json.Marshal(announcements)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	os.WriteFile("announcement.json", b, 0644)
	w.Write([]byte("success"))
}
