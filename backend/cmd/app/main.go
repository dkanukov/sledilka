package main

import (
	"context"
	"fmt"
	"log"

	_ "backend/docs"
	"backend/internal/app/sledilka"
	"backend/internal/db"
	"backend/internal/network"
	"backend/internal/tokener"
	"github.com/compose-spec/compose-go/v2/cli"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

//	@title			Sledilka API
//	@version		1.0
//	@description	API for Sledilka service
//	@termsOfService	http://swagger.io/terms/

// @host      192.168.1.75:8081

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name X-Auth-Token
// @tokenUrl https://0.0.0.0:8081/token
// @scope.write Grants write access
// @scope.admin Grants read and write access to administrative information

func main() {
	ctx := context.Background()

	composeFilePath := "docker-compose.yaml"
	projectName := "sledilka"

	options, err := cli.NewProjectOptions(
		[]string{composeFilePath},
		cli.WithOsEnv,
		cli.WithDotEnv,
		cli.WithName(projectName),
	)
	if err != nil {
		log.Fatal(err)
	}

	project, err := options.LoadProject(ctx)
	if err != nil {
		log.Fatal(err)
	}

	dbInfo, err := project.GetService("db")
	if err != nil {
		log.Fatal(err)
	}

	tokenerInfo, err := project.GetService("token-service")
	if err != nil {
		log.Fatal(err)
	}

	//networkerInfo, err := project.GetService("networking-service")
	//if err != nil {
	//	log.Fatal(err)
	//}

	//streamingInfo, err := project.GetService("streaming-service")
	//if err != nil {
	//	log.Fatal(err)
	//}

	DBConnection, err := db.StartupDB(ctx, dbInfo)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("DB started")

	conn, err := grpc.Dial(
		fmt.Sprintf("%s:%v", "0.0.0.0", tokenerInfo.Ports[0].Published),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		log.Fatal(err)
	}
	tokenerClient := tokener.NewTokenerClient(conn)

	conn, err = grpc.Dial(
		fmt.Sprintf("%s:%v", "0.0.0.0", 8282),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)

	networkerClient := network.NewNetworkClient(conn)

	app := sledilka.New(
		DBConnection,
		tokenerClient,
		networkerClient,
		fmt.Sprintf("http://0.0.0.0:%v/", 8181),
		fmt.Sprintf(":%v", 8081))
	log.Fatal(app.Run())
}
