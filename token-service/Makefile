.PHONY: generate-structs
generate-proto:
	mkdir -p internal/tokener
	go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
	export PATH="$PATH:$(go env GOPATH)/bin"
	protoc --go_opt=paths=source_relative --go_out=internal/tokener \
			--go-grpc_out=internal/tokener --go-grpc_opt=paths=source_relative \
			api/tokener/tokener.proto
	mv internal/tokener/api/tokener/* internal/tokener/
	rm -rf internal/tokener/api