FROM node:16

COPY . /app
WORKDIR /app
RUN if [ ! -d "node_modules" ]; then npm ci; fi
#RUN npx swagger-typescript-api -p backend/docs/swagger.json -o frontend/app/api/api.ts
CMD ["npm", "run", "dev"]