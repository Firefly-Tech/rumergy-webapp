from django.db import models
from . import UserProfile
# from . import Meter
from django.utils.timezone import now


class DataLog(models.Model):
    start_date = models.DateTimeField(default=now)
    end_date = models.DateTimeField(default=now)
    # meter = models.ForeignKey(Meter, related_name='data_logs', on_delete=models.PROTECT)
    user = models.ForeignKey(UserProfile, related_name='data_logs', on_delete=models.PROTECT)
