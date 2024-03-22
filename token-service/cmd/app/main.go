package main

import (
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"log"
	"net"
	"token-service/internal/app"
	"token-service/internal/tokener"
)

const (
	serverAddr = "0.0.0.0:8082"
)

func main() {
	lis, err := net.Listen("tcp", serverAddr)
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
