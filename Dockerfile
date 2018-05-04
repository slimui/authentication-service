FROM node:8.11.1-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
COPY src/ /usr/src/app/src/
RUN npm install

EXPOSE 80

CMD node ./src/index.js
