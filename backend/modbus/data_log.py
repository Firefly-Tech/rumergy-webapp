from datetime import datetime
import os
import time
import modbus_client as Modbus
import requests
from pymodbus.payload import BinaryPayloadDecoder
from pymodbus.constants import Endian
from apscheduler.triggers.interval import IntervalTrigger
from pymodbus.client.asynchronous.tcp import AsyncModbusTCPClient as ModbusClient
from pymodbus.client.asynchronous import schedulers
from apscheduler.schedulers.background import BackgroundScheduler


scheduler = BackgroundScheduler()


def read_points_list(meter_id, points_list):

    meter_record = requests.get(f'http://127.0.0.1:8000/api/meters/{meter_id}/').json()
    meter_ip = meter_record['ip']
    meter_port = meter_record['port']

    for point in points_list:
        data_point = requests.get(f'http://127.0.0.1:8000/api/data-points/{point}/').json()
        start_address = data_point['start_address']
        end_address = data_point['end_address']
        data_type = data_point['data_type']
        regtype = data_point['register_type']

        meter = Modbus.connect_meter(meter_ip, meter_port)
        result = Modbus.decode_message(Modbus.read_point(meter, regtype, start_address, end_address), data_type)
        meter.close()
        print(result)

        

def start():
    scheduler.start()
    scheduler.add_job(read_points_list, 'interval', [1,[1,2]], seconds=3)
    try:
        # This is here to simulate application activity (which keeps the main thread alive).
        while True:
            pass
            # time.sleep(2)
    except (KeyboardInterrupt, SystemExit):
        # Not strictly necessary if daemonic mode is enabled but should be done if possible
        scheduler.shutdown()



start()


   