from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save


class UserProfile(models.Model):
    """Model for non-auth related user info"""

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(_("first name"), max_length=30)
    last_name = models.CharField(_("last name"), max_length=60)

    class Role(models.TextChoices):
        """Role choices"""

        ADMIN = "ADM", _("Admin")
        ADVANCED = "ADV", _("Advanced")
        INACTIVE = "INA", _("Inactive")

    role = models.CharField(max_length=3, choices=Role.choices, default=Role.INACTIVE)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
