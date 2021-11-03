from django.contrib.auth.models import User
from django.db import models
from . import UserProfile
from django.utils.translation import gettext_lazy as _


class AccessRequest(models.Model):
    """Access request model"""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="access_request")
    timestamp = models.DateTimeField(auto_now_add=True)
    ocupation = models.CharField(max_length=20, default="None")
    justification = models.CharField(
        max_length=200, default="No justification provided"
    )

    class Status(models.TextChoices):
        """Status choices"""

        ACTIVE = "ACT", _("Active")
        ACCEPTED = "ACC", _("Accepted")
        REJECTED = "REJ", _("Rejected")

    status = models.CharField(
        max_length=3, choices=Status.choices, default=Status.ACTIVE
    )
