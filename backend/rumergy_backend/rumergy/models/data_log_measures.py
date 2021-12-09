from django.db import models
from .data_log import DataLog
from .data_point import DataPoint
from django.utils.translation import gettext_lazy as _


class DataLogMeasures(models.Model):
    """Data log measures model"""

    data_log = models.ForeignKey(DataLog, related_name='data_log_measures', on_delete=models.CASCADE)
    data_point = models.ForeignKey(DataPoint, related_name='data_log_measures', on_delete=models.RESTRICT)
    value = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Status(models.TextChoices):
        OK = "OK", _("OK")
        ERROR = "ERR", _("Error")

    status = models.CharField(max_length=3, choices=Status.choices, default=Status.OK)

