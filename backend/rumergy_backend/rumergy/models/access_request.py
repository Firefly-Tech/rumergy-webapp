from django.db import models
from . import User


class AccessRequest(models.Model):
    """Access request model"""

    user = models.ForeignKey(User, related_name='access_request', on_delete=models.CASCADE)  # TODO: Check Cascade
    timestamp = models.DateTimeField(auto_now_add=True)
    occupation = models.CharField(max_length=20)
    justification = models.CharField(max_length=200)
