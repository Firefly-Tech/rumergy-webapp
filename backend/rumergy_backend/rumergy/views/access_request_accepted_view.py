from django.conf.global_settings import DEFAULT_FROM_EMAIL, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD

from backend.rumergy_backend.rumergy.models import AccessRequest
from rest_framework import viewsets
from backend.rumergy_backend.rumergy.serializers import AccessRequestSerializer
from django.core.mail import send_mail


class AccessRequestAcceptedViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing AccessRequest instances."""

    serializer_class = AccessRequestSerializer
    queryset = AccessRequest.objects.all()

    def send_acceptance_email_to_user(self):
        """Sends acceptance email to user"""

        send_mail(
            'RUMergy: Access Request Accepted',
            'Your access request has been accepted.',
            DEFAULT_FROM_EMAIL,  # TODO: Decide on email for application
            [AccessRequest.user.email],  # TODO: Verify if this is valid
            fail_silently=False,
            auth_user=EMAIL_HOST_USER,  # TODO: Decide on email for application
            auth_password=EMAIL_HOST_PASSWORD,  # TODO: Decide on email for application
        )
