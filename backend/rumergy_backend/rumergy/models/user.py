from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager
from .user_profile_manager import UserProfileManager


class User(AbstractBaseUser, PermissionsMixin):
    """Database model for users in the system"""

    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(_("first name"), max_length=30)
    last_name = models.CharField(_("last name"), max_length=60)

    class Role(models.TextChoices):
        ADMIN = "ADM", _("Admin")
        ADVANCED = "ADV", _("Advanced")
        INACTIVE = "INA", _("Inactive")

    role = models.CharField(max_length=3, choices=Role.choices, default=Role.INACTIVE)

    objects = UserProfileManager()
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "role", "password"]

    def __str__(self):
        """Return string representation of our user"""
        return self.email
