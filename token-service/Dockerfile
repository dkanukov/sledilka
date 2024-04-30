FROM golang:1.21

RUN mkdir -p /app

COPY . /app

WORKDIR /app


# Start the app
RUN go mod tidy
CMD [ "go", "run", "cmd/app/main.go" ]
