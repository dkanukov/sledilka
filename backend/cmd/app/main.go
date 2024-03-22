package main

import (
	"backend/internal/db"
	"backend/internal/tokener"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
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

// @host      0.0.0.0:8081

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name X-Auth-Token
// @tokenUrl https://0.0.0.0:8081/token
// @scope.write Grants write access
// @scope.admin Grants read and write access to administrative information

func main() {
	DBConnection, err := db.StartupDB()
	if err != nil {
		log.Fatal(err)
	}
	conn, err := grpc.Dial("token-service:8082", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatal(err)
	}
	tokenerClient := tokener.NewTokenerClient(conn)
	router := handlers.GetHandlers(DBConnection, tokenerClient)
	router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)
	router.HandleFunc("/swagger", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/swagger/", http.StatusSeeOther)
	})
	cors.AllowAll()
	corsOpt := cors.AllowAll()
	app := http.Server{
		Addr:    "0.0.0.0:8081",
		Handler: corsOpt.Handler(router),
	}

	log.Fatal(app.ListenAndServe())
}
