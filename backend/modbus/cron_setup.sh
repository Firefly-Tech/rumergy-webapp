#!/bin/sh
`printenv > /etc/environment`
crontab -l > mycron
echo "*/15 * * * * $1/pd.sh $1 > /tmp/periodic_data.out 2>&1" >> mycron
crontab mycron
rm mycron
