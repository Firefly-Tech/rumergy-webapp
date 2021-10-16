from django.db import models
from . import User

class AccessRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)