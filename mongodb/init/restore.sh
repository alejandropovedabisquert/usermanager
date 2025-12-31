#!/bin/bash
echo "Esperando a que MongoDB esté listo..."
sleep 10

echo "Restaurando backup..."
mongorestore --host localhost --port 27017 /dump/

echo "Restauración completada!"