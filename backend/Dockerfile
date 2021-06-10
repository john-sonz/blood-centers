FROM node:15.14.0

WORKDIR /backend

COPY ./package.json .
COPY ./package-lock.json .

ADD entrypoint.sh /bin/docker-entrypoint.sh

RUN chmod +x /bin/docker-entrypoint.sh

RUN npm update
RUN npm install

COPY . .

EXPOSE 4000

USER root

ENTRYPOINT ["/bin/docker-entrypoint.sh"]
CMD npm run dev