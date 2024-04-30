.PHONY: generate-structs
generate-proto:
	mkdir -p internal/network
	go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
	export PATH="$PATH:$(go env GOPATH)/bin"
	protoc --go_opt=paths=source_relative --go_out=internal/network \
			--go-grpc_out=internal/network --go-grpc_opt=paths=source_relative \
			api/network/network.proto
	mv internal/network/api/network/* internal/network/
	rm -rf internal/network/api