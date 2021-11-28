import logging

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
import requests

logger = logging.getLogger(__name__)

# scheduler = BlockingScheduler()

def my_job(text):
  print(text)



# def print_read(meter, regtype, start, end):
#     result = Modbus.decode_message(Modbus.read_point(meter, regtype, start, end),'FLT')
#     print(result)

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


#                 # schedule_reading(meter_ip, point, start_date, end_date)
#                 scheduler.add_job(print_read, trigger=IntervalTrigger(seconds=sampling_rate), args=[meter, point_regtype, point_start_address, point_end_address])


# The `close_old_connections` decorator ensures that database connections, that have become
# unusable or are obsolete, are closed before and after our job has run.
@util.close_old_connections
def delete_old_job_executions(max_age=604_800):
  """
  This job deletes APScheduler job execution entries older than `max_age` from the database.
  It helps to prevent the database from filling up with old historical records that are no
  longer useful.
  
  :param max_age: The maximum length of time to retain historical job execution records.
                  Defaults to 7 days.
  """
  DjangoJobExecution.objects.delete_old_job_executions(max_age)


class Command(BaseCommand):
  help = "Runs APScheduler."
  scheduler = BlockingScheduler()

  def handle(self, *args, **options):
    self.scheduler.add_jobstore(DjangoJobStore(), "default")
    # data_logger()
    # scheduler = BlockingScheduler()
    # scheduler.add_jobstore(DjangoJobStore(), "default")
    # scheduler.add_job(my_job, trigger=IntervalTrigger(seconds=3), args=[text] , id="my_job",max_instances=1, replace_existing=True)
    # scheduler.add_job(data_logger, trigger=IntervalTrigger(seconds=3), id="data_logger", max_instances=3, replace_existing=True)

    # scheduler.add_job(
    #   my_job,
    #   trigger=CronTrigger(second="*/10"), [text],  # Every 10 seconds
    #   id="my_job",  # The `id` assigned to each job MUST be unique
    #   max_instances=1,
    #   replace_existing=True,
    # )
    logger.info("Added job 'my_job'.")

    # scheduler.add_job(
    #   delete_old_job_executions,
    #   trigger=CronTrigger(
    #     day_of_week="mon", hour="00", minute="00"
    #   ),  # Midnight on Monday, before start of the next work week.
    #   id="delete_old_job_executions",
    #   max_instances=1,
    #   replace_existing=True,
    # )
    logger.info(
      "Added weekly job: 'delete_old_job_executions'."
    )


    try:
      logger.info("Starting scheduler...")
      self.scheduler.start()
      # while True:
      #   pass
    except KeyboardInterrupt:
      logger.info("Stopping scheduler...")
      self.scheduler.shutdown()
      logger.info("Scheduler shut down successfully!")

