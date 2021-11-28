from datetime import datetime
import os
import time
import modbus_client as Modbus
import requests
from apscheduler.triggers.interval import IntervalTrigger
# import sys
# sys.path.insert(0,'/Users/sebmrcd/Desktop/rumergy-webapp/backend/rumergy_backend/rumergy/management/commands')
# from runapscheduler import Command

# scheduler = BackgroundScheduler()

def print_read(meter, regtype, start, end):
    result = Modbus.decode_message(Modbus.read_point(meter, regtype, start, end),'FLT')
    print(result)

# def data_logger():
#     '''Get data logs entries '''
#     ''' TODO Add header with access token to requests '''
#     logs = requests.get('http://127.0.0.1:8000/api/data-logs/').json()
    
#     for log in logs:
#         log_id = log['id']
#         meter_id = log['meter']
#         data_points = log['data_points']
#         start_date = log['start_date']
#         end_date = log['end_date']
#         sampling_rate = log['sampling_rate']

#         # print(start_date)
#         start = datetime.strptime(f"{start_date}","%Y-%m-%dT%H:%M:%SZ")
#         end = datetime.strptime(f"{end_date}","%Y-%m-%dT%H:%M:%SZ")
#         print(start, end)
#         print(datetime.now() < start)

#         # TODO change > to <. Only doing '>' for testig purposes.
#         if datetime.now() > start:
#             for point in data_points:
#                 point_record = requests.get(f'http://127.0.0.1:8000/api/data-points/{point}/').json()
#                 point_start_address = point_record['start_address']
#                 point_end_address = point_record['end_address']
#                 point_data_type = point_record['data_type']
#                 point_regtype = point_record['register_type']
#                 print(point_regtype)

#                 meter_ip = requests.get(f'http://127.0.0.1:8000/api/meters/{meter_id}/').json()['ip']
#                 meter = Modbus.connect_meter(meter_ip, 502)

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

        

        result = Modbus.decode_message(Modbus.read_point(meter, regtype, start_address, end_address), data_type)
        print(result)
    # schedule_reading(meter_ip, point, start_date, end_date)

        

def start():
    scheduler.start()
    data_logger()
    try:
        # This is here to simulate application activity (which keeps the main thread alive).
        while True:
            pass
            # time.sleep(2)
    except (KeyboardInterrupt, SystemExit):
        # Not strictly necessary if daemonic mode is enabled but should be done if possible
        scheduler.shutdown()





# Command.scheduler.add_job(read_points_list, trigger=IntervalTrigger(seconds=3), args=[1,[1,2]])

read_points_list(1, [1,2])

# if __name__ == '__main__':
# data_logger()
    # start()
 
#     # scheduler = BackgroundScheduler()
#     # meter = Modbus.connect_meter('192.168.0.2', 502)
#     # logging.basicConfig()
#     # logging.getLogger('apscheduler').setLevel(logging.DEBUG)
#     # start = datetime(2021, 11, 21, 0, 38)
#     scheduler.start()
#     # scheduler.add_job(print_read, 'interval', [meter, 'HOLD', 256, 257], start_date=start, seconds=3)
#     try:
#         # This is here to simulate application activity (which keeps the main thread alive).
#         while True:
#             time.sleep(2)
#     except (KeyboardInterrupt, SystemExit):
#         # Not strictly necessary if daemonic mode is enabled but should be done if possible
#         scheduler.shutdown()

   