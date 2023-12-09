FROM golang:1.21

RUN mkdir -p /app

COPY . /app

WORKDIR /app

# Start the app
CMD [ "go", "run", "cmd/app/main.go" ]
