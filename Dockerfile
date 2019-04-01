FROM buildkite/puppeteer:latest

WORKDIR /app
COPY app/package.json /app
COPY app/package-lock.json /app
RUN npm install
COPY ./app /app

RUN  npm install
