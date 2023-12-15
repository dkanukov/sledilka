all: api backend frontend start

api:
	GOBIN="$(PWD)/backend/" go install github.com/swaggo/swag/cmd/swag@latest
	cd backend; ./swag init -g cmd/app/main.go
	npx swagger-typescript-api -p backend/docs/swagger.json -o frontend/app/api/generated/ -n api

frontend:
	if [ ! -d "frontend/node_modules" ]; then npm ci --prefix frontend; fi

backend:
	cd backend; go get .; cd ..

token-service:
	cd token-service; go get .; cd ..

# TODO: add token service
start:
	go run -C backend ./cmd/app/main.go & npm run --prefix frontend dev

.PHONY: api backend frontend start
