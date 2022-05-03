FROM node:18-slim

WORKDIR /hayaoshi
COPY . /hayaoshi

EXPOSE 80/tcp

RUN npm install

CMD ["node", "index.js"]
