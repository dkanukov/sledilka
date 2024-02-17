package main

import (
	"backend/internal/db"
	"log"
	"net/http"

	_ "backend/docs"
	"backend/internal/handlers"
	"github.com/rs/cors"
	httpSwagger "github.com/swaggo/http-swagger"
)

//	@title			Sledilka API
//	@version		1.0
//	@description	API for Sledilka service
//	@termsOfService	http://swagger.io/terms/

// @host      localhost:8081

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name X-Auth-Token
// @tokenUrl https://localhost:8081/token
// @scope.write Grants write access
// @scope.admin Grants read and write access to administrative information

func main() {
	DBConnection, err := db.StartupDB()
	if err != nil {
		log.Fatal(err)
	}
	router := handlers.GetHandlers(DBConnection)
	router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)
	router.HandleFunc("/swagger", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/swagger/", http.StatusSeeOther)
	})

	cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"*"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: false,
	})
	app := http.Server{
		Addr:    "0.0.0.0:8081",
		Handler: cors.Handler(router),
	}

	log.Fatal(app.ListenAndServe())
}
