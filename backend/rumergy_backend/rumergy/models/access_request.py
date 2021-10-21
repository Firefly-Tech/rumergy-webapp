from django.db import models
from . import User


class AccessRequest(models.Model):
    """Access request model"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    ocupation = models.CharField(max_length=20)
    justification = modles.CharField(max_length=200)
