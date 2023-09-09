#!/bin/bash
set -x
pid=0

# Clean container gracefully
cleanup() {
  if [ -z "$pid"]; then
    pid=0
  fi
  if [ "$pid" -ne 0 ]; then
    kill -SIGTERM "$pid"
    wait "$pid"
  fi

  echo "Cleaning up..."
  forever stop ./server/server.js

  exit 143 # 128 + 15 -- SIGTERM
}

trap 'kill ${!}; cleanup' SIGTERM

# Execute forever
echo "Starting Loopback process with forever..."
forever start ./server/server.js
pid="$!"

# wait forever
while true; do
  tail -f /dev/null &
  wait ${!}
done
