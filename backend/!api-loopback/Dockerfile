FROM node:8

RUN npm i npm@latest -g &&\
  npm install -g forever

WORKDIR /worklog-api

COPY ./entrypoint.sh ./
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
