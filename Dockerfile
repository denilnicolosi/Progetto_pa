FROM node:lts-stretch-slim

WORKDIR /home/node/src
COPY . .

RUN ls -l
#RUN npm install
#CMD ["node", "main.js"]