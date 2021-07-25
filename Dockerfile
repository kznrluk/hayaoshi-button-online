FROM node:latest

WORKDIR /hayaoshi

COPY . /hayaoshi

RUN npm install
