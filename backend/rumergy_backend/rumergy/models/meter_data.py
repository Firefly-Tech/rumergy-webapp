from django.db import models
from . import Meter
import DataPoints


class MeterData(models.Model):
    """Database model for meter data in the system"""

    meter = models.ForeignKey(Meter, related_name='meter_data', on_delete=models.CASCADE)
    data_point = models.ForeignKey(DataPoint, related_name='meter_data', on_delete=models.RESTRICT)
    timestamp = models.DateTimeField(auto_now_add=True)
    avg = models.FloatField()
    min = models.FloatField()
    max = models.FloatField()
