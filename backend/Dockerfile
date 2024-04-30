FROM golang:1.21

RUN mkdir -p /app

COPY . /app
WORKDIR /app
RUN GOBIN="/app/." go install github.com/swaggo/swag/cmd/swag@latest
RUN go mod tidy
RUN	./swag init -g cmd/app/main.go --parseDependency --parseInternal
RUN GOBIN="/app/." go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
RUN ./sqlc generate


# Start the app
CMD [ "go", "run", "cmd/app/main.go" ]