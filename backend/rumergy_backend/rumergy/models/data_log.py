from django.db import models
from . import User


class DataLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.RESTRICT)
