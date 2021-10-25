from django.db import models
from . import Meter


class MeterData(models.Model):
    """Database model for meter data in the system"""

    meter = models.ForeignKey(Meter, on_delete=models.RESTRICT)
    # data_points = models.ForeignKey(DataPoints, on_delete=models.RESTRICT)
    timestamp = models.DateTimeField(auto_now_add=True)
    avg = models.FloatField()
    min = models.FloatField()
    max = models.FloatField()
