#start with a nodejs base-image
FROM node:latest

WORKDIR /usr/src/app

#install required nodejs packages
RUN npm install influx
RUN npm install mqtt
RUN npm install express
RUN npm install cors
RUN npm install ws

#copy the nodejs script into the container
COPY . .

EXPOSE 8000

#set start command for container
CMD [ "node", "app.js"]