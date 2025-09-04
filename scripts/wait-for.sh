#!/usr/bin/env bash
set -e
host="$1"
shift
until pg_isready -h "$host" -p 5432 > /dev/null 2>&1; do
  echo "Waiting for Postgres at $host..."
  sleep 1
done
exec "$@"
