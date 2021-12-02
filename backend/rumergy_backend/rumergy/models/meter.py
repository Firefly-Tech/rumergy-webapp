from django.db import models
from .meter_model import MeterModel
from .building import Building
from django.utils.translation import gettext_lazy as _


class Meter(models.Model):
    """Database model for meters in the system"""

    meter_model = models.ForeignKey(MeterModel, related_name='meters', on_delete=models.RESTRICT)
    building = models.ForeignKey(Building, related_name='meters', on_delete=models.RESTRICT)
    name = models.CharField(max_length=30, unique=True)
    ip = models.CharField(max_length=30)
    port = models.IntegerField(default=502)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['ip', 'port'], name="unique meter IP")
        ]
        
    substation = models.CharField(max_length=60)
    longitude = models.FloatField()
    latitude = models.FloatField()
    comments = models.CharField(max_length=200, default="No comment provided")
    panel_id = models.CharField(max_length=60)
    serial_number = models.CharField(max_length=100, unique=True)

    class Status(models.TextChoices):
        ACTIVE = "ACT", _("Active")
        INACTIVE = "INA", _("Inactive")
        ERROR = "ERR", _("Error")

    status = models.CharField(max_length=3, choices=Status.choices, default=Status.ACTIVE)

    def __str__(self):
        """Return string representation of the meter"""
        return self.name
