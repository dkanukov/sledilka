package geosearch

import (
	"log"
	"net/http"
)

// @Summary		Поиск адреса по строке
// @Tags		geosearch
// @Accept		json
// @Paramq		query	string	false	"name search by q"	Format(email)
// @Produce		json
// @Success		200
// @Failure		500
// @Router		/geosearch [get]
func Get(w http.ResponseWriter, r *http.Request) {
	queryValue := r.URL.Query().Get("q")

	log.Println(queryValue)
}
