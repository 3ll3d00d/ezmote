#!/usr/bin/env sh
set -eu
envsubst '${CMDSERVER_IP} ${CMDSERVER_PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf
exec "$@"