FROM golang:1.21

RUN mkdir -p /app

COPY . /app

WORKDIR /app
RUN GOBIN="/app/." go install github.com/swaggo/swag/cmd/swag@latest
RUN	./swag init -g cmd/app/main.go

# Start the app
RUN go mod tidy
CMD [ "go", "run", "cmd/app/main.go" ]