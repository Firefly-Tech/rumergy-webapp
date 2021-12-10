from django.contrib.auth.models import Group, User
from django.core.management.base import BaseCommand

from rumergy_backend.rumergy.models import UserProfile


class Command(BaseCommand):
    help = "Creates an admin user"

    def add_arguments(self, parser):
        parser.add_argument("username", type=str)
        parser.add_argument("email", type=str)
        parser.add_argument("password", type=str)
        parser.add_argument("first_name", type=str)
        parser.add_argument("last_name", type=str)

    def handle(self, *args, **options):
        # Create user
        try:
            user = User.objects.create_superuser(
                username=options["username"],
                email=options["email"],
                password=options["password"],
            )
        except Exception as e:
            print("Failed to create user:", str(e))
            return

        # Create profile
        try:
            profile = UserProfile.objects.create(
                first_name=options["first_name"],
                last_name=options["last_name"],
                role="ADM",
                user=user,
            )
        except Exception as e:
            print("Failed to create user profile", str(e))
            return

        # Add to admin group
        try:
            group = Group.objects.get(name="admin")
            group.user_set.add(user)
        except Exception as e:
            print("Failed to add user to admin group", str(e))
            return

        print("User created successfully")
