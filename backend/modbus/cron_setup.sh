#!/bin/sh
path=`pwd`
echo $path
crontab -l > mycron
echo "*/15 * * * * $path/pd.sh $path" >> mycron
crontab mycron
rm mycron
