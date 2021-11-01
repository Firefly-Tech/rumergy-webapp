from django.conf.global_settings import DEFAULT_FROM_EMAIL, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD

from backend.rumergy_backend.rumergy.models import AccessRequest
from rest_framework import viewsets
from backend.rumergy_backend.rumergy.serializers import AccessRequestSerializer
from django.core.mail import send_mail


class AccessRequestDeniedViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing AccessRequest instances."""

    serializer_class = AccessRequestSerializer
    queryset = AccessRequest.objects.all()

    def send_denial_email_to_user(self):
        """Sends denial email to user"""

        send_mail(
            'RUMergy: Access Request Denied',
            'Your access request has been denied. Contact administrative staff if you still wish to gain access.',
            DEFAULT_FROM_EMAIL,  # TODO: Decide on email for application
            [AccessRequest.user.email],  # TODO: Verify if this is valid
            fail_silently=False,
            auth_user=EMAIL_HOST_USER,  # TODO: Decide on email for application
            auth_password=EMAIL_HOST_PASSWORD,  # TODO: Decide on email for application
        )
