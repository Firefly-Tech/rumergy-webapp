#!/bin/sh
cd $1

PATH=/usr/local/bin:$PATH

if [ -z "$2"] # If not dev
then
    python periodic_data.py
else
    pipenv run python periodic_data.py
fi

