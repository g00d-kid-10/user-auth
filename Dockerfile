FROM node:16-alpine

WORKDIR /dist

COPY . /dist

RUN npm install

EXPOSE 3001

CMD node server.js
