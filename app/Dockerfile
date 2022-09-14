FROM node:lts-stretch-slim

WORKDIR /home/node/app
COPY ./package*.json ./
COPY ./certs ./certs

#RUN npm install --global nodemon
RUN npm install
RUN npm install -g ts-node typescript '@types/node'

CMD ["ts-node","src/index.ts"]
#CMD ["nodemon", "src/index.ts", "-L"]