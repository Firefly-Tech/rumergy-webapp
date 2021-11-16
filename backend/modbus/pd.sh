#!/bin/bash
cd ~/Desktop/rumergy-webapp/modbus
PATH=/usr/local/bin:$PATH
pipenv run python periodic_data.py


