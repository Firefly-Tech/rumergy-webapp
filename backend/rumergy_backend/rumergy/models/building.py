from django.db import models


class Building(models.Model):
    """Database model for buildings in the system"""

    name = models.CharField(max_length=60, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        """Return string representation of the building"""
        return self.name
