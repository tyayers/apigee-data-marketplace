FROM node:21-alpine

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package.json package-lock.json ./

RUN npm install

COPY ./build .

EXPOSE 3000

CMD [ "node", "index.js" ]