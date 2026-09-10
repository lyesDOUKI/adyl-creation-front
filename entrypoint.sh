#!/bin/sh
set -eu

envsubst '${KEYCLOAK_URL} ${KEYCLOAK_REALM} ${KEYCLOAK_CLIENT_ID}' \
  < /usr/share/nginx/html/env.template.js \
  > /usr/share/nginx/html/env.js

exec nginx -g 'daemon off;'