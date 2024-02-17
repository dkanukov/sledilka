package images

import (
	builinerrors "errors"
	"fmt"
	gmux "github.com/gorilla/mux"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// @Summary      Upload File
// @Tags         images
// @Accept       mpfd
// @Param		request	formData	file	 true "картинка слоя"
// @Success      200
// @Router       /images [post]
func UploadFile(w http.ResponseWriter, r *http.Request) {
	// Maximum upload of 10 MB files
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
	file, handler, err := r.FormFile(key)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if _, err := os.Stat(fmt.Sprintf("images/%s", handler.Filename)); builinerrors.Is(err, nil) {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("duplicate image name"))
		return
	}

	defer file.Close()
	dst, err := os.Create("images/" + handler.Filename)
	defer dst.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Copy the uploaded file to the created file on the filesystem
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// @Summary      Load File
// @Tags         images
// @Produce      mpfd
// @Param		file	path  string	true "file name with extension"
// @Success      200 {image} file
// @Router       /images/{file} [get]
func Load(w http.ResponseWriter, r *http.Request) {
	filename := gmux.Vars(r)["file"]
	if filename == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if _, err := os.Stat(fmt.Sprintf("images/%s", filename)); builinerrors.Is(err, os.ErrNotExist) {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("image not found"))
		return
	}
	extension := strings.ToLower(filepath.Ext(filename))[1:]
	if extension == "jpg" {
		extension = "jpeg"
	}
	w.Header().Set("Content-Type", "image/"+extension)
	file, _ := os.Open("images/" + filename)
	resp, err := io.ReadAll(file)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err)
		return
	}
	w.Write(resp)
}
