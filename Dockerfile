FROM mhart/alpine-node:10.15.1 as node-angular-cli
WORKDIR /app
COPY package.json /app
RUN yarn 
COPY . /app
RUN yarn build:web


FROM mhart/alpine-node
WORKDIR /app
COPY --from=node-angular-cli /app/dist .
EXPOSE 80
ENV PORT 80
RUN npm install http-server -g
CMD [ "http-server" ]