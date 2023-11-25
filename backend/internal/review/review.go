package review

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"backend/internal/entity"
	"backend/internal/utils"
)

func Get(w http.ResponseWriter, _ *http.Request) {
	file, err := os.OpenFile("review.json", os.O_RDONLY|os.O_CREATE, 777)
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

func Post(w http.ResponseWriter, r *http.Request) {
	file, err := os.Open("review.json")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	b, err := io.ReadAll(file)
	file.Close()
	var reviews []entity.Review
	if err = json.Unmarshal(b, &reviews); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	b, err = io.ReadAll(r.Body)
	log.Println(string(b))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	reqData := entity.NewReview{}
	err = json.Unmarshal(b, &reqData)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	newReview := entity.Review{
		Name:      reqData.Name,
		Comment:   reqData.Comment,
		Rating:    reqData.Rating,
		CreatedAt: time.Now().Unix(),
		Id:        utils.NewId(reviews),
	}
	reviews = append(reviews, newReview)
	b, err = json.Marshal(newReview)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(b)
	b, err = json.Marshal(reviews)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	os.WriteFile("review.json", b, 0644)
}

func Delete(w http.ResponseWriter, r *http.Request) {
	file, err := os.Open("review.json")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	b, err := io.ReadAll(file)
	file.Close()
	var reviews []entity.Review
	if err = json.Unmarshal(b, &reviews); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	query := r.URL.Query()
	id, err := strconv.Atoi(query.Get("id"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	index := utils.IndexOfID(int64(id), reviews)
	if index == -1 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	reviews[index] = reviews[len(reviews)-1]
	reviews[len(reviews)-1] = entity.Review{}
	reviews = reviews[:len(reviews)-1]
	b, err = json.Marshal(reviews)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	os.WriteFile("review.json", b, 0644)
	w.Write([]byte("success"))
}
