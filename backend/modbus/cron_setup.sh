#!/bin/sh
path=`pwd`
`printenv > /etc/environment`
(crontab -l 2>/dev/null; echo "*/15 * * * $path/pd.sh $path > /tmp/periodic_data.out 2>&1") | crontab -
