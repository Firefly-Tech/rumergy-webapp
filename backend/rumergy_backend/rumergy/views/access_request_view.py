from django.conf.global_settings import DEFAULT_FROM_EMAIL, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD

from backend.rumergy_backend.rumergy.models import AccessRequest
from rest_framework import viewsets
from backend.rumergy_backend.rumergy.serializers import AccessRequestSerializer
from django.core.mail import send_mail


class AccessRequestViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing AccessRequest instances."""

    serializer_class = AccessRequestSerializer
    queryset = AccessRequest.objects.all()

    def send_access_request_notification_email_to_admins(self):
        """Sends email to admins"""

        if self.action == 'create':
            send_mail(
                'RUMergy: Access Request Notification',
                'A new access request has been submitted.',
                DEFAULT_FROM_EMAIL,  # TODO: Decide on email for application
                ['to@example.com'],  # All admin emails go here
                fail_silently=False,
                auth_user=EMAIL_HOST_USER,  # TODO: Decide on email for application
                auth_password=EMAIL_HOST_PASSWORD,  # TODO: Decide on email for application
            )
