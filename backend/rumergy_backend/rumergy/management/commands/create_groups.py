"""
Create permission groups
Create permissions (read only) to models for a set of groups
"""
import logging

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from django.contrib.auth.models import Permission

MODELS_PERMISSIONS_ADV = {
    "building": ["view"],
    "datalog": ["add", "change", "delete", "view"],
    "datalogmeasures": ["view"],
    "datapoint": ["view"],
    "meter": ["view"],
    "meterdata": ["view"],
    "metermodel": ["view"],
    "resetpasswordtoken": ["add", "change", "delete", "view"],
}


class Command(BaseCommand):
    help = "Creates read only default permission groups for users"

    def handle(self, *args, **options):
        # Create advanced group
        adv_group, created = Group.objects.get_or_create(name="advanced")
        perms = []
        if created:
            for model, permissions in MODELS_PERMISSIONS_ADV.items():
                for permission in permissions:
                    codename = "{}_{}".format(permission, model)
                    print("Adding {} advanced".format(codename))

                    try:
                        model_perm = Permission.objects.get(codename=codename)
                        perms.append(model_perm)
                    except:
                        logging.warning(
                            "Permission not found with codename '{}'".format(codename)
                        )
                        continue
            adv_group.permissions.add(*perms)
        else:
            print("Advanced group already exists")

        # Create admin group
        adm_group, created = Group.objects.get_or_create(name="admin")
        if created:
            permissions = list(Permission.objects.all())
            print("Adding all permissions to admin")
            adm_group.permissions.add(*permissions)
        else:
            print("Admin group already exists")

        # Create inactive group (no privileges)
        Group.objects.get_or_create(name="inactive")

        print("Created default group and permissions")
