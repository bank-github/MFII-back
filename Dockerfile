FROM node:20

WORKDIR /usr/src/app/MFii-Backend

COPY ./package.json .

RUN rm -rf node_modules
RUN npm install

COPY . .

EXPOSE 7770

CMD [ "npm", "start" ]