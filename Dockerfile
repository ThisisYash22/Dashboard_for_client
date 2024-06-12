FROM node:alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli
RUN npm install chartjs-adapter-date-fns
RUN npm install chartjs-plugin-zoom

RUN npm install chart.js@^3.0.0
RUN npm install chartjs-plugin-streaming

# RUN npm install luxon
# RUN npm install chartjs-adapter-luxon

RUN npm install

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]