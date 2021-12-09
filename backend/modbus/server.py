from apscheduler.schedulers.background import BackgroundScheduler
from pytz import utc
import requests
import rpyc
from rpyc.utils.server import ThreadedServer
from decouple import config

import modbus_client as Modbus

import logging

logging.basicConfig(
    filename="../logs/scheduler_server.log",
    encoding="utf-8",
    level=logging.INFO,
    format="[%(levelname)-8s: %(asctime)s] %(message)s",
    datefmt="%m/%d/%Y %I:%M:%S %p",
)


def read_points_list(log_id, meter_id, points_list):

    access_token, refresh_token = Modbus.get_token()

    meter_record = requests.get(
        f"http://127.0.0.1:8000/api/meters/{meter_id}/",
        headers={"Authorization": f"Bearer {access_token}"},
    ).json()
    meter_ip = meter_record["ip"]
    meter_port = meter_record["port"]

    for point in points_list:

        data_point = requests.get(
            f"http://localhost:8000/api/data-points/{point}/",
            headers={"Authorization": f"Bearer {access_token}"},
        ).json()
        start_address = data_point["start_address"]
        end_address = data_point["end_address"]
        data_type = data_point["data_type"]
        regtype = data_point["register_type"]

        meter = Modbus.connect_meter(meter_ip, meter_port)
        read_result = Modbus.read_point(meter, regtype, start_address, end_address)
        meter.close()
        try:

            result = Modbus.decode_message(read_result, data_type)
            log_dict = {
                "data_log": f"{log_id}",
                "data_point": f"{point}",
                "value": f"{result}",
                "status": "OK",
            }

            requests.post(
                "http://localhost:8000/api/data-log-measures/",
                headers={"Authorization": f"Bearer {access_token}"},
                json=log_dict,
            )

        except:
            log_dict = {
                "data_log": f"{log_id}",
                "data_point": f"{point}",
                "value": "-1",
                "status": "ERR",
            }

            requests.post(
                "http://localhost:8000/api/data-log-measures/",
                headers={"Authorization": f"Bearer {access_token}"},
                json=log_dict,
            )



class SchedulerService(rpyc.Service):
    """Scheduler rpyc service. Exposes functions for rpc commmunication."""

    def exposed_add_job(self, func, *args, **kwargs):
        return scheduler.add_job(func, *args, **kwargs)

    def exposed_modify_job(self, job_id, jobstore=None, **changes):
        return scheduler.modify_job(job_id, jobstore, **changes)

    def exposed_reschedule_job(
        self, job_id, jobstore=None, trigger=None, **trigger_args
    ):
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


if __name__ == "__main__":
    scheduler = BackgroundScheduler(timezone=utc)
    scheduler.add_jobstore(
        "sqlalchemy",
        url=f"mysql+mysqldb://{config('DB_USER')}:{config('DB_PASS')}@{config('DB_HOST')}/{config('DB_NAME')}",
    )

    logging.info("Starting scheduler server...")
    scheduler.start()

    protocol_config = {"allow_public_attrs": True}

    server = ThreadedServer(
        SchedulerService,
        port=config("SCHED_SERVER_PORT"),
        protocol_config=protocol_config,
    )

    try:
        logging.info("Starting rpyc server...")
        server.start()
    except (KeyboardInterrupt, SystemExit):
        logging.error("Server has stopped")
    finally:
        logging.error("Shutting down server...")
        scheduler.shutdown()
