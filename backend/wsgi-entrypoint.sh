#!/bin/sh

cd /app/backend
mkdir logs

# Run migrations when db ready
until ./manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done

echo "Migrations completed"

# Load fixtures

echo "Loading fixtures..."
./manage.py loaddata initial_buildings.json
echo "Fixtures loaded"

# Create groups
echo "Creating user groups..."
./manage.py create_groups

# Setup cron job

cd modbus
echo "Setting up cron job..."
./cron_setup.sh || cron_failed = 1

if [ ${cron_failed:-0} -eq 1 ]
then
 echo "Cron setup failed"
fi

cd ..
echo "Starting supervisord..."
supervisord -c "./supervisord.conf"
