package main

import (
	"log"
	"net/http"

	"github.com/rs/cors"

	handlers "geosearch/internal"
)

//	@title			Geosearch for Sledilka API
//	@version		1.0
//	@description	API for Sledilka service
//	@termsOfService	http://swagger.io/terms/

// @host      0.0.0.0:8083

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name X-Auth-Token
// @tokenUrl https://0.0.0.0:8081/token
// @scope.write Grants write access
// @scope.admin Grants read and write access to administrative information
func main() {
	corsOpt := cors.AllowAll()
	router := handlers.GetHandlers()

	app := http.Server{
		Addr:    "0.0.0.0:8083",
		Handler: corsOpt.Handler(router),
	}

	log.Fatal(app.ListenAndServe())
}
