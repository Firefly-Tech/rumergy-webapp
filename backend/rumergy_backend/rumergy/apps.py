from django.apps import AppConfig


class RumergyConfig(AppConfig):
    """Rumergy App Config"""

    default_auto_field = "django.db.models.BigAutoField"
    name = "rumergy_backend.rumergy"

    def ready(self):
        import rumergy_backend.rumergy.signals
