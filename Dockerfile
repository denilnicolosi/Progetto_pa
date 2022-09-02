FROM node:lts-stretch-slim

WORKDIR /home/node/src
COPY . .

CMD ["ls", "-la"]

#RUN npm install
CMD ["node","main.js"]
#ENV NODE_PATH=./build
#RUN npm run build