from django.contrib.auth.models import BaseUserManager


class UserProfileManager(BaseUserManager):
    """Manager for user profiles"""

    def create_user(self, email, first_name, last_name, role, password=None):
        """Create a new user profile"""
        if not email:
            raise ValueError("User must have an email address")
        if not first_name:
            raise ValueError("User must have a first name")
        if not last_name:
            raise ValueError("User must have a last name")
        if not role:
            raise ValueError("User must have a role")

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=role,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, first_name, last_name, role, password=None):
        """Create a new superuser profile"""
        user = self.create_user(email, first_name, last_name, role, password)
        user.is_superuser = True
        user.is_staff = True

        user.save(using=self._db)

        return user
