from django.db import models


class MeterModel(models.Model):
    """Database model for meter models in the system"""

    name = models.CharField(max_length=60, unique=True)

    def __str__(self):
        """Return string representation of the meter model"""
        return self.name
