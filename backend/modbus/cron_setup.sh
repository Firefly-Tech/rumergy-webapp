#!/bin/sh
path=`pwd`
echo $path
dev=$1
crontab -l > mycron
echo "*/15 * * * * $path/pd.sh $path $dev" >> mycron
crontab mycron
rm mycron
