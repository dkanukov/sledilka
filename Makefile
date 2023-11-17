all: run

run:
	go run -C backend ./cmd/app/app.go & npm run --prefix frontend dev


