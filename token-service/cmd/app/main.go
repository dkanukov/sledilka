package main

import (
	"context"
	"fmt"
	"github.com/compose-spec/compose-go/v2/cli"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"log"
	"net"
	"token-service/internal/app"
	"token-service/internal/tokener"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
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

	tokenerInfo, err := project.GetService("token-service")
	if err != nil {
		log.Fatal(err)
	}

	lis, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%v", tokenerInfo.Ports[0].Target))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	reflection.Register(s)
	tokenerService := app.New()
	tokener.RegisterTokenerServer(s, tokenerService)
	log.Println("starting grpc")
	log.Fatal(s.Serve(lis))
}
