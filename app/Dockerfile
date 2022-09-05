FROM node:lts-stretch-slim

WORKDIR /home/node/app
COPY ./package*.json ./

RUN npm install --global nodemon
RUN npm install

#CMD ["node","src/index.ts"]
CMD ["nodemon", "src/index.ts", "-L"]