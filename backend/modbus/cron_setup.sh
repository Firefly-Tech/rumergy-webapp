#!/bin/sh
`printenv > /etc/environment`
(crontab -l 2>/dev/null; echo "*/15 * * * * $1/pd.sh $1 > /tmp/periodic_data.out 2>&1") | crontab -
