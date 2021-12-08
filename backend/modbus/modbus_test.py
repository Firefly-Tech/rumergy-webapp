
import requests
from django.conf import settings
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from django.core.management.base import BaseCommand
from django_apscheduler.jobstores import DjangoJobStore
from django_apscheduler.models import DjangoJobExecution
from django_apscheduler import util
from modbus import modbus_client as Modbus
import time

# ip_test = '192.168.0.2'
# port = 502
# meter = modbus.connect_meter(ip_test, port)
# consumption_start = 256
# consumption_end = 257

# result = modbus.decode_message(modbus.read_point(meter, 'HOLD', consumption_start, consumption_end), 'FLT')

# print(result)
# access_token, refresh_token = modbus.get_token()
# newip = requests.patch('http://127.0.0.1:8000/api/meters/1/',headers={"Authorization": f"Bearer {access_token}"} ,data={"status": f"ACT"}).json()
# print(newip)

def read_points_list(meter_id, points_list):
    meter_record = requests.get(f'http://127.0.0.1:8000/api/meters/{meter_id}/').json()

    meter_ip = meter_record['ip']
    meter_port = meter_record['port']
    meter = Modbus.connect_meter(meter_ip, meter_port)
    for point in points_list:
        data_point = requests.get(f'http://127.0.0.1:8000/api/data-points/{point}/').json()
        start_address = data_point['start_address']
        end_address = data_point['end_address']
        data_type = data_point['data_type']
        regtype = data_point['register_type']

        # print(start_address)
        # print(end_address)
        # print(data_type)
        

        result = Modbus.decode_message(Modbus.read_point(meter, regtype, start_address, end_address), data_type)
        print(result)

scheduler = BlockingScheduler()
# scheduler.add_jobstore(DjangoJobStore(), "default")
scheduler.add_job(read_points_list, trigger=IntervalTrigger(seconds=3), args=[1,[1,2]], max_instances=3)
try:
#   logger.info("Starting scheduler...")
    scheduler.start()
except KeyboardInterrupt:
#   logger.info("Stopping scheduler...")
    scheduler.shutdown()
#   logger.info("Scheduler shut down successfully!")