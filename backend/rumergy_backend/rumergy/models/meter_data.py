from django.db import models
from . import Meter
# from . import DataPoints


class MeterData(models.Model):
    """Database model for meter data in the system"""

    meter = models.ForeignKey(Meter, related_name='meter_data', on_delete=models.CASCADE)
    # data_points = models.ForeignKey(DataPoints, related_name='meter_data', on_delete=models.RESTRICT)
    # TODO: Remove comment
    timestamp = models.DateTimeField(auto_now_add=True)
    avg = models.FloatField()
    min = models.FloatField()
    max = models.FloatField()
