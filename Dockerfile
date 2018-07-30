FROM node:8.9-alpine as node-angular-cli
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build:prod


FROM node:8.9-alpine
WORKDIR /app
COPY --from=node-angular-cli /app/dist .
EXPOSE 80
ENV PORT 80
RUN npm install http-server -g
CMD [ "http-server" ]