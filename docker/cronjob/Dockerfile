
FROM ubuntu:latest

RUN apt-get update && apt-get -y install cron

WORKDIR /app

COPY ../config/cron.config.js cron.config.js

COPY ../db/scripts/cronjob/cronjob-generate.js

COPY ../db/scripts/cronjob/load-config.js

COPY ../db/scripts/cronjob/sync.js

