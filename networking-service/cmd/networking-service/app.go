package main

import (
	"context"
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"networking-service/internal/app"
	"networking-service/internal/network"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	//composeFilePath := "docker-compose.yaml"
	//projectName := "sledilka"
	//
	//options, err := cli.NewProjectOptions(
	//	[]string{composeFilePath},
	//	cli.WithOsEnv,
	//	cli.WithDotEnv,
	//	cli.WithName(projectName),
	//)
	//if err != nil {
	//	log.Fatal(err)
	//}
	//
	//project, err := options.LoadProject(ctx)
	//if err != nil {
	//	log.Fatal(err)
	//}

	//networkerInfo, err := project.GetService("networking-service")
	//if err != nil {
	//	log.Fatal(err)
	//}

	lis, err := net.Listen("tcp", fmt.Sprintf(":%v", 8282))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s, err := app.NewServer(ctx)
	if err != nil {
		log.Fatalln(err)
	}
	grpcServer := grpc.NewServer()
	reflection.Register(grpcServer)
	network.RegisterNetworkServer(grpcServer, s)
	log.Fatal(grpcServer.Serve(lis))
}
