from django.db import models
from django.contrib.auth.models import User

from rumergy_backend.rumergy.models.data_point import DataPoint
from .meter import Meter
from django.utils.timezone import now


class DataLog(models.Model):
    meter = models.ForeignKey(
        Meter, related_name="data_logs", on_delete=models.RESTRICT
    )
    user = models.ForeignKey(User, related_name="data_logs", on_delete=models.CASCADE)
    data_points = models.ManyToManyField(DataPoint, related_name="data_logs")
    start_date = models.DateTimeField(default=now)
    end_date = models.DateTimeField(default=now)
