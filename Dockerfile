FROM node:11.1.0

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app

RUN npm install

RUN npm run seed

RUN npm run build

EXPOSE 3004

CMD [ "npm", "run", "start" ]

