#!/usr/bin/env bash
set -e
node -v
echo "Applying migrations..."
npx prisma migrate deploy
if [ -n "$SEED_ON_START" ]; then
  echo "Seeding database..."
  node dist/prisma/seed.js || true
fi
echo "Starting app..."
node dist/src/server.js
