all: run

run:
	if [ ! -d "frontend/node_modules" ]; then npm ci --prefix frontend; fi
	cd backend; go get .; cd ..
	go run -C backend ./cmd/app/app.go & npm run --prefix frontend dev
