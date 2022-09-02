FROM node:lts-stretch-slim

WORKDIR /home/node/src
COPY . .

RUN npm install
#ENV NODE_PATH=./build
#RUN npm run build
CMD ["node","main.js"]

#ENV NODE_PATH=./build
#RUN npm run build