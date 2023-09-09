#!/bin/bash

if [ ! -z $(docker images -q worklog-api-loopback:latest) ]; then
  echo "[Found] Docker image for worklog-api-loopback does exist!"
else
  echo "[Not found] Docker image for worklog-api-loopback does not exist! Creating..."
  docker build -t worklog-api-loopback:latest .
  echo "[Created] Docker image for worklog-api-loopback has been created!"
fi
