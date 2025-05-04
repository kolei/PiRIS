FROM node:20-alpine

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY . .

RUN npm install

EXPOSE 3025

CMD [ "npm", "start" ]
