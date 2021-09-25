FROM node:latest

COPY package*.json ./

RUN npm install 

COPY . .

CMD [ "npx", "bittorrent-tracker", "--ws", "--port", "$PORT" ]