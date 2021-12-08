"""
This is an example showing how to make the scheduler into a remotely accessible service.
It uses RPyC to set up a service through which the scheduler can be made to add, modify and remove
jobs.
To run, first install RPyC using pip. Then change the working directory to the ``rpc`` directory
and run it with ``python -m server``.
"""

import rpyc
from rpyc.utils.server import ThreadedServer
import requests
import modbus_client as Modbus
import traceback
from pytz import utc
from datetime import datetime, timezone

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.events import EVENT_JOB_ERROR


def print_text(text):
    print(text)


def listener(event):
  print(f'Job {event.job_id} raised {event.exception.__class__.__name__}')


def read_points_list(log_id, meter_id, points_list):
    
    
    access_token, refresh_token = Modbus.get_token()

    meter_record = requests.get(f'http://127.0.0.1:8000/api/meters/{meter_id}/', headers={"Authorization": f"Bearer {access_token}"}).json()
    meter_ip = meter_record['ip']
    meter_port = meter_record['port']
    

    for point in points_list:
        
        data_point = requests.get(f'http://127.0.0.1:8000/api/data-points/{point}/', headers={"Authorization": f"Bearer {access_token}"}).json()
        start_address = data_point['start_address']
        end_address = data_point['end_address']
        data_type = data_point['data_type']
        regtype = data_point['register_type']
        # print(data_point)
        # print('HELLO')

        
        meter = Modbus.connect_meter(meter_ip, meter_port)
        result = Modbus.decode_message(Modbus.read_point(meter, regtype, start_address, end_address), data_type)
        meter.close()
        print(result)
        timestamp = datetime.now(timezone.utc)
        log_dict = {"data_log": f"{log_id}", "data_point": f"{point}", "value": f"{result}", "timestamp": f"{timestamp}"}
        post = requests.post('http://127.0.0.1:8000/api/data-log-measures/', headers={"Authorization": f"Bearer {access_token}"}, json=log_dict)
 
        


class SchedulerService(rpyc.Service):
    def exposed_add_job(self, func, *args, **kwargs):
        return scheduler.add_job(func, *args, **kwargs)

    def exposed_modify_job(self, job_id, jobstore=None, **changes):
        return scheduler.modify_job(job_id, jobstore, **changes)

    def exposed_reschedule_job(self, job_id, jobstore=None, trigger=None, **trigger_args):
        return scheduler.reschedule_job(job_id, jobstore, trigger, **trigger_args)

    def exposed_pause_job(self, job_id, jobstore=None):
        return scheduler.pause_job(job_id, jobstore)

    def exposed_resume_job(self, job_id, jobstore=None):
        return scheduler.resume_job(job_id, jobstore)

    def exposed_remove_job(self, job_id, jobstore=None):
        scheduler.remove_job(job_id, jobstore)

    def exposed_get_job(self, job_id):
        return scheduler.get_job(job_id)

    def exposed_get_jobs(self, jobstore=None):
        return scheduler.get_jobs(jobstore)


if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_listener(listener, EVENT_JOB_ERROR)
    scheduler.start()
    protocol_config = {'allow_public_attrs': True}
    server = ThreadedServer(SchedulerService, port=12345, protocol_config=protocol_config)
    try:
        server.start()
    except (KeyboardInterrupt, SystemExit):
        pass
    finally:
        scheduler.shutdown()