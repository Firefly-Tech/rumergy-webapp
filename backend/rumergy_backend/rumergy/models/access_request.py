from django.db import models
from . import UserProfile


class AccessRequest(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.PROTECT)
