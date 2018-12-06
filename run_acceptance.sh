#!/bin/bash

export NODE_ENV='production'
if [ -n "$API_URL" ]; then
  export API_URL=$API_URL
else
  export API_URL="https://api.test.beefboard.mooo.com"
fi

echo $API_URL

node server &
PROCESS_ID=$!

kill_server() {
  kill -9 $PROCESS_ID
}

trap kill_server SIGINT SIGTERM

export ACCEPTENCE_SERVER=$ACCEPTENCE_SERVER

if [[ "$1" != "update" ]]; then
  npm run jest -- --config jest.acceptance.config.js
else
  npm run jest -- --config jest.acceptance.config.js -u
fi

EXIT_CODE=$?
kill_server

exit $EXIT_CODE
