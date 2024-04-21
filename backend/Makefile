PHONY: generate-proto
generate-proto:
	cp ../token-service/api/tokener/tokener.proto api/
	mkdir -p internal/tokener
	go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
	export PATH="$PATH:$(go env GOPATH)/bin"
	protoc --go_opt=paths=source_relative --go_out=internal/tokener \
			--go-grpc_out=internal/tokener --go-grpc_opt=paths=source_relative \
			api/tokener.proto
	mv internal/tokener/api/* internal/tokener/
	rm -rf internal/tokener/api

	cp ../networking-service/api/network/network.proto api/
	mkdir -p internal/network
	protoc --go_opt=paths=source_relative --go_out=internal/network \
			--go-grpc_out=internal/network --go-grpc_opt=paths=source_relative \
			api/network.proto
	mv internal/network/api/* internal/network/
	rm -rf internal/network/api