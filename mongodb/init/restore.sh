#!/bin/bash
set -e

echo "Esperando a que MongoDB esté listo..."
until mongosh --host localhost --port 27017 --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  echo "MongoDB no está listo. Reintentando en 5 segundos..."
  sleep 5
done

echo "Restaurando backup..."
mongorestore --host localhost --port 27017 --db user_manager --drop /dump/user_manager

echo "Restauración completada!"