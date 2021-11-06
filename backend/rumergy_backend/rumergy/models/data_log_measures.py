from django.db import models
from .data_log import DataLog
from .data_point import DataPoint


class DataLogMeasures(models.Model):
    """Data log measures model"""

    value = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    data_log = models.ForeignKey(DataLog, related_name='data_log_measures', on_delete=models.CASCADE)
    data_point = models.ForeignKey(DataPoint, related_name='data_log_measures', on_delete=models.RESTRICT)
