from django.db import models
from . import UserProfile
# from . import Meter


class DataLog(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    # meter = models.ForeignKey(Meter, related_name='data_logs', on_delete=models.PROTECT)
    user = models.ForeignKey(UserProfile, related_name='data_logs', on_delete=models.PROTECT)
