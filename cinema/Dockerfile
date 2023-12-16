FROM node:14-alpine

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY . .

RUN npm install

EXPOSE 3019

CMD [ "npm", "start" ]
