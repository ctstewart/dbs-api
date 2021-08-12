FROM node:14

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm i

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "start" ]
