# src/server/Dockerfile
FROM node:14

WORKDIR /usr/src/app

# Install Mosquitto MQTT broker
RUN apt-get update && apt-get install -y mosquitto

COPY server.js ./

RUN npm install mqtt
RUN npm install ws

CMD mosquitto -d && node server.js
