FROM node:15.14.0

WORKDIR /backend

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

EXPOSE 4000

USER root

ENTRYPOINT [ "./entrypoint.sh" ]
CMD npm run dev