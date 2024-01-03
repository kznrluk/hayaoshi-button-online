FROM node:20-slim

WORKDIR /hayaoshi
COPY . /hayaoshi

ENV PORT=80
EXPOSE 80/tcp

RUN npm install

CMD ["node", "index.js"]
