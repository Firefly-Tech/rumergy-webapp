from pytz import utc
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from django_apscheduler.jobstores import register_events


class MetaSingleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(MetaSingleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class SchedulerHandler(metaclass=MetaSingleton):
    scheduler = None

    def retrieve_scheduler(self):
        if self.scheduler is None:
            self.scheduler = BackgroundScheduler(timezone=utc)
            self.scheduler.add_jobstore(DjangoJobStore(), 'djangojobstore')
            self.scheduler.start()
            register_events(self.scheduler)
            self.scheduler.print_jobs(jobstore='djangojobstore')
        return self.scheduler

