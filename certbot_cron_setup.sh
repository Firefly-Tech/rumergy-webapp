#!/bin/sh

if [ -z "$1" ]
then
  echo "Path not supplied"
  exit 0
fi

(crontab -l 2>/dev/null; echo "0 0 * * * $1/certbot_renew.sh $1 > /tmp/certbot_renew.out") | crontab -

