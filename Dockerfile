FROM node:latest

COPY package*.json ./

RUN npm install 

COPY . .

CMD [ "npx", "concurrently", "npx bittorrent-tracker --ws --port $PORT", "npm run server" ]