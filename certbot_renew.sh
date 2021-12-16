#!/bin/sh

if [ -z "$1" ]
then
    echo "No argument supplied"
    exit 0
fi

cd $1
docker-compose run --rm certbot renew
