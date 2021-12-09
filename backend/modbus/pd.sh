#!/bin/sh
cd $1

PATH=/usr/local/bin:/usr/bin:$PATH

python periodic_data.py

