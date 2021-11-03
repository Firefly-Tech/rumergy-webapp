from django.conf.global_settings import DEFAULT_FROM_EMAIL, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD

from rumergy_backend.rumergy.models import AccessRequest
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rumergy_backend.rumergy.serializers import AccessRequestSerializer
from django.core.mail import send_mail


class AccessRequestViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing AccessRequest instances."""

    serializer_class = AccessRequestSerializer
    queryset = AccessRequest.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        super().perform_create(serializer)
        send_mail(
                'RUMergy: Access Request Notification',
                'A new access request has been submitted.',
                DEFAULT_FROM_EMAIL,  # TODO: Decide on email for application
                ['orlando.ruiz5@upr.edu'],  # All admin emails go here
                fail_silently=False,
                auth_user=EMAIL_HOST_USER,  # TODO: Decide on email for application
                auth_password=EMAIL_HOST_PASSWORD,  # TODO: Decide on email for application
            )


    @action(detail=True, methods=["put"])
    def accept(self, request, pk=None):
        accessRequest = AccessRequest.objects().get(id=pk)
        user = accessRequest.user
        user.profile.role = "ADV"
        user.save()
        accessRequest.status = "ACC"
        accessRequest.save()

        send_mail(
            'RUMergy: Access Request Accepted',
            'Your access request has been accepted.',
            DEFAULT_FROM_EMAIL,  # TODO: Decide on email for application
            [user.email],
            fail_silently=False,
            auth_user=EMAIL_HOST_USER,  # TODO: Decide on email for application
            auth_password=EMAIL_HOST_PASSWORD,  # TODO: Decide on email for application
        )
        
        return Response("OK", status.HTTP_200_OK)

    @action(detail=True, methods=["put"])
    def reject(self, request, pk=None):
        accessRequest = AccessRequest.objects().get(id=pk)
        user = accessRequest.user
        accessRequest.status = "REJ"
        accessRequest.save()

        send_mail(
            'RUMergy: Access Request Denied',
            'Your access request has been denied. Contact administrative staff if you still wish to gain access.',
            DEFAULT_FROM_EMAIL,  # TODO: Decide on email for application
            [user.email],
            fail_silently=False,
            auth_user=EMAIL_HOST_USER,  # TODO: Decide on email for application
            auth_password=EMAIL_HOST_PASSWORD,  # TODO: Decide on email for application
        )

        return Response("OK", status.HTTP_200_OK)
