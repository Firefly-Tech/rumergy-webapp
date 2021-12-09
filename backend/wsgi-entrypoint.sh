#!/bin/sh

cd /app/backend
mkdir logs

# Run migrations when db ready
until ./manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done

# Load fixtures
./manage.py loaddata initial_buildings.json

gunicorn rumergy_backend.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4 --access-logfile ./logs/gunicorn.log --daemon

cd modbus

# Start rpyc server
python server.py &

# Setup cron job
./cron_setup.sh
