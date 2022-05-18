FROM node:16.13-slim

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package.json ./
RUN npm i

COPY --chown=node:node ./ ./

CMD tail -f /dev/null
