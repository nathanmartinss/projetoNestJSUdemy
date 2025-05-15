FROM node:lts-alpine
WORKDIR /app-node
COPY . .
RUN npm install
ENTRYPOINT ["npm", "run", "start:dev"]
