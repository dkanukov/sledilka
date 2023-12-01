all: run

run:
	if [ ! -d "frontend/node_modules" ]; then npm ci --prefix frontend; fi
	cd backend; go get .; cd ..
	GOBIN="$(PWD)/backend/" go install github.com/swaggo/swag/cmd/swag@latest
	cd backend; ./swag init -g cmd/app/main.go
	go run -C backend ./cmd/app/main.go & npm run --prefix frontend dev
