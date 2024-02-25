package main

import (
	"github.com/rs/cors"
	httpSwagger "github.com/swaggo/http-swagger"
	_ "imaging/docs"
	"imaging/internal/handlers"
	"log"
	"net/http"
)

//	@title			Imaging for Sledilka API
//	@version		1.0
//	@description	API for Imaging service
//	@termsOfService	http://swagger.io/terms/

// @host      0.0.0.0:8088

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name X-Auth-Token
// @tokenUrl https://0.0.0.0:8081/token
// @scope.write Grants write access
// @scope.admin Grants read and write access to administrative information

func main() {
	router := handlers.New()
	router.HandleFunc("/swagger/", httpSwagger.WrapHandler)
	router.HandleFunc("/swagger", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/swagger/", http.StatusSeeOther)
	})
	cors.AllowAll()
	corsOpt := cors.AllowAll()
	app := http.Server{
		Addr:    "0.0.0.0:8088",
		Handler: corsOpt.Handler(router),
	}

	log.Fatal(app.ListenAndServe())
}
