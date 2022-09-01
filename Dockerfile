FROM node:lts-stretch-slim

WORKDIR /home/node/src
COPY . .


RUN npm install
CMD ["node","main.js"]
#CMD ["ls", "-la"]
#ENV NODE_PATH=./build
#RUN npm run build