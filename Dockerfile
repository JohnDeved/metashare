FROM node:latest
CMD [ "npx", "bittorrent-tracker", "--ws", "--port", "$PORT" ]