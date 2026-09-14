#!/bin/sh
set -eu

envsubst '${KEYCLOAK_URL} ${KEYCLOAK_REALM} ${KEYCLOAK_CLIENT_ID}' '${GEOCODE_API_URL}' \
  < /usr/share/nginx/html/env.template.js \
  > /config/env.js

exec nginx -g 'daemon off;'