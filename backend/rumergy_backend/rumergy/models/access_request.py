from django.contrib.auth.models import User
from django.db import models
from . import UserProfile


class AccessRequest(models.Model):
    """Access request model"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    ocupation = models.CharField(max_length=20, default="None")
    justification = models.CharField(
        max_length=200, default="No justification provided"
    )
