from django.contrib.gis.geos import Point
from django.db import models
from django import forms
from . import MeterModel
from . import Building
from django.utils.translation import gettext_lazy as _


class Meter(models.Model):
    """Database model for meters in the system"""

    name = models.CharField(max_length=30)
    meter_model = models.ForeignKey(MeterModel, on_delete=models.RESTRICT)
    building = models.ForeignKey(Building, on_delete=models.RESTRICT)
    ip = forms.GenericIPAddressField()
    port = models.IntegerField(default=502)
    substation = models.CharField(max_length=60)
    coordinates = Point()
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
