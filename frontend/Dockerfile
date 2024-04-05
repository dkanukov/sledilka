FROM node:18.17

COPY . /app
WORKDIR /app
RUN if [ ! -d "node_modules" ]; then npm ci; fi
CMD ["npm", "run", "dev"]