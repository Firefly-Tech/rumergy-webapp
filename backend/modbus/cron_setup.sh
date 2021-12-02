#!/bin/bash
path=`pwd`
crontab -l > mycron
echo "*/15 * * * * $path/pd.sh" >> mycron
crontab mycron
rm mycron
