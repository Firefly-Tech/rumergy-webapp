from django.db import models
from .meter import Meter
from .data_point import DataPoint


class MeterData(models.Model):
    """Database model for meter data in the system"""

    data_point = models.ForeignKey(DataPoint, related_name='meter_data', on_delete=models.RESTRICT)
    meter = models.ForeignKey(Meter, related_name='meter_data', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    avg = models.FloatField()
    min = models.FloatField()
    max = models.FloatField()
