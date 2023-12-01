all: api backend frontend start

api:
	GOBIN="$(PWD)/backend/" go install github.com/swaggo/swag/cmd/swag@latest
	cd backend; ./swag init -g cmd/app/main.go

frontend:
	if [ ! -d "frontend/node_modules" ]; then npm ci --prefix frontend; fi

backend:
	cd backend; go get .; cd ..

start:	
	go run -C backend ./cmd/app/main.go & npm run --prefix frontend dev

