from django.db import models
from . import DataLog
from . import DataPoint

# TODO: Add relationships


class DataLogMeasures(models.Model):
    """Data log measures model"""

    value = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    data_log = model.ForeignKey(DataLog, on_delete=models.RESTRICT)
    data_point = model.ForeignKey(DataPoint, on_delete=models.RESTRICT)
