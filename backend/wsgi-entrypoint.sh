#!/bin/sh

cd /app/backend
mkdir logs

until ./manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done

./manage.py loaddata initial_buildings.json

gunicorn rumergy_backend.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4 --access-logfile ./logs/gunicorn.log --daemon

cd modbus

python server.py &

./cron_setup.sh

#####################################################################################
# Options to DEBUG Django server
# Optional commands to replace abouve gunicorn command

# Option 1:
# run gunicorn with debug log level
# gunicorn server.wsgi --bind 0.0.0.0:8000 --workers 1 --threads 1 --log-level debug

# Option 2:
# run development server
# DEBUG=True ./manage.py runserver 0.0.0.0:8000

