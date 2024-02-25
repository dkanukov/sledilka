package handlers

import (
	"fmt"
	"github.com/disintegration/imaging"
	"image"
	"imaging/internal/luminance"
	"log"
	"net/http"
)

// @Summary      Is image Low-Lighted
// @Tags         luminance
// @Accept       mpfd
// @Param		request	formData	file	 true "фото"
// @Success      200 {boolean} boolean
// @Router       / [post]
func Luminance(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println(err)
		return
	}

	// Get handler for filename, size and headers
	var key string
	for k := range r.MultipartForm.File {
		key = k
		break
	}
	file, _, err := r.FormFile(key)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	img, format, err := image.Decode(file)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println(err)
		return
	}
	log.Println(format)
	lum := imaging.Histogram(img)
	w.Write(fmt.Append(nil, luminance.IsLowLight(lum)))
}
