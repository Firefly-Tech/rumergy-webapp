from django.conf.global_settings import DEFAULT_FROM_EMAIL, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD

from rumergy_backend.rumergy.models import AccessRequest
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rumergy_backend.rumergy.serializers import AccessRequestSerializer
from django.core.mail import send_mail
from django.conf import settings


class AccessRequestViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing AccessRequest instances."""

    serializer_class = AccessRequestSerializer
    queryset = AccessRequest.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.AllowAny] # Only use for testing

    def perform_create(self, serializer):
        super().perform_create(serializer)
        send_mail(
                'RUMergy: Access Request Notification',
                'A new access request has been submitted.',
                settings.EMAIL_HOST_USER,  # TODO: Decide on email for application
                ['admins@example.com'],  # All admin emails go here
                fail_silently=False,
            )


    @action(detail=True, methods=["put"])
    def accept(self, request, pk=None):
        accessRequest = AccessRequest.objects.get(id=pk)
        if (accessRequest.status != "ACT"):
            return Response("This access request has already been processed", status.HTTP_400_BAD_REQUEST)
        # TODO: Check what status to use for this
        user = accessRequest.user
        user.profile.role = "ADV"
        user.profile.save()
        accessRequest.status = "ACC"
        accessRequest.save()

        send_mail(
            'RUMergy: Access Request Accepted',
            'Your access request has been accepted.',
            settings.EMAIL_HOST_USER,  # TODO: Decide on email for application
            [user.email],
            fail_silently=False,
        )
        
        return Response("OK", status.HTTP_200_OK)

    @action(detail=True, methods=["put"])
    def reject(self, request, pk=None):
        accessRequest = AccessRequest.objects.get(id=pk)
        if (accessRequest.status != "ACT"):
            return Response("This access request has already been processed", status.HTTP_400_BAD_REQUEST)
        # TODO: Check what status to use for this
        user = accessRequest.user
        accessRequest.status = "REJ"
        accessRequest.save()

        send_mail(
            'RUMergy: Access Request Rejected',
            'Your access request has been rejected. Contact administrative staff if you still wish to gain access.',
            settings.EMAIL_HOST_USER,  # TODO: Decide on email for application
            [user.email],
            fail_silently=False,
        )

        return Response("OK", status.HTTP_200_OK)
