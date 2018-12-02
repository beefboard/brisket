#!/bin/bash

export NODE_ENV='production'
if [ -n "$API_URL" ]; then
  export API_URL="api.test.beefboard.mooo.com"
else
  export API_URL=$API_URL
fi

echo $API_URL

node server &
PROCESS_ID=$!

kill_server() {
  kill -9 $PROCESS_ID
}

trap kill_server SIGINT SIGTERM

export ACCEPTENCE_SERVER=$ACCEPTENCE_SERVER
npm run jest -- --config jest.acceptence.config.js
EXIT_CODE=$?
kill_server

exit $EXIT_CODE
