from django.db import models
from . import MeterModel
from . import Building
from django.utils.translation import gettext_lazy as _


class Meter(models.Model):
    """Database model for meters in the system"""

    name = models.CharField(max_length=30)
    meter_model = models.ForeignKey(MeterModel, related_name='meters', on_delete=models.RESTRICT)
    building = models.ForeignKey(Building, related_name='meters', on_delete=models.RESTRICT)
    ip = models.CharField(max_length=30)
    port = models.IntegerField(default=502)
    substation = models.CharField(max_length=60)
    longitude = models.FloatField()
    latitude = models.FloatField()
    comments = models.CharField(max_length=200)
    panel_id = models.CharField(max_length=60)
    serial_number = models.CharField(max_length=100)

    class Status(models.TextChoices):
        ACTIVE = "ACT", _("Active")
        INACTIVE = "INA", _("Inactive")

    status = models.CharField(max_length=3, choices=Status.choices, default=Status.ACTIVE)

    def __str__(self):
        """Return string representation of the meter"""
        return self.name
