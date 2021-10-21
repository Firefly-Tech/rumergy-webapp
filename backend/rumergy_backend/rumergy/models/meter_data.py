from django.db import models
from . import Meter


class MeterData(models.Model):
    """Database model for meter data in the system"""

    meter_id = models.ForeignKey(Meter, on_delete=models.PROTECT)
    # data_points_id = models.ForeignKey(DataPoints, on_delete=models.PROTECT)
    timestamp = models.DateTimeField(auto_now_add=True)
    avg = models.FloatField()
    min = models.FloatField()
    max = models.FloatField()

