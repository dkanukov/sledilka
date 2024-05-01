package geosearch

import (
	"log"
	"net/http"
)

// ListAccounts godoc
// @Summary      List accounts
// @Description  get accounts
// @Tags         accounts
// @Accept       json
// @Produce      json
// @Param        q    query     string  false  "name search by q"  Format(email)
// @Success      200  {array}   entity.GeosearchResponse
// @Router       /accounts [get]
func Get(w http.ResponseWriter, r *http.Request) {
	queryValue := r.URL.Query().Get("q")

	if queryValue == "" {
	}

	log.Println(queryValue)
}
