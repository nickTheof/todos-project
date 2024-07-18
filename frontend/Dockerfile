
FROM node:20-alpine as BUILD_IMAGE

WORKDIR '/frontend'

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]


