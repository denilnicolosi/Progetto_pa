FROM node:lts-stretch-slim

WORKDIR /home/node/app
COPY ./package*.json ./

RUN npm install --global nodemon
RUN npm install

#CMD ["node","src/main.js"]
CMD ["nodemon", "src/main.ts", "-L"]