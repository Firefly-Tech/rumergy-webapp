from rumergy_backend.rumergy.models import AccessRequest
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rumergy_backend.rumergy.serializers import AccessRequestSerializer
from django.core.mail import send_mail
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend


class AccessRequestViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing AccessRequest instances."""

    serializer_class = AccessRequestSerializer
    queryset = AccessRequest.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status"]
    # permission_classes = [permissions.AllowAny] # Only use for testing

    def perform_create(self, serializer):
        super().perform_create(serializer)
        admin_emails = list(
            User.objects.filter(profile__role="ADM").values_list("email", flat=True)
        )
        send_mail(
            "RUMergy: Access Request Notification",
            "A new access request has been submitted.",
            settings.EMAIL_FROM,
            admin_emails,
            fail_silently=False,
        )

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def request(self, request, pk=None):
        """Wrapper for request creation"""

        serializer = AccessRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)

        return Response("OK", status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["put"])
    def accept(self, request, pk=None):
        accessRequest = AccessRequest.objects.get(id=pk)
        if accessRequest.status != "ACT":
            return Response(
                "This access request has already been processed",
                status.HTTP_400_BAD_REQUEST,
            )
        user = accessRequest.user
        user.profile.role = "ADV"
        user.profile.save()

        # Update user group membership
        user.groups.clear()
        group = Group.objects.get(name="advanced")
        group.user_set.add(user)

        accessRequest.status = "ACC"
        accessRequest.save()

        send_mail(
            "RUMergy: Access Request Accepted",
            "Your access request has been accepted.",
            settings.EMAIL_FROM,
            [user.email],
            fail_silently=False,
        )

        return Response("OK", status.HTTP_200_OK)

    @action(detail=True, methods=["put"])
    def reject(self, request, pk=None):
        accessRequest = AccessRequest.objects.get(id=pk)
        if accessRequest.status != "ACT":
            return Response(
                "This access request has already been processed",
                status.HTTP_400_BAD_REQUEST,
            )
        user = accessRequest.user
        accessRequest.status = "REJ"
        accessRequest.save()

        send_mail(
            "RUMergy: Access Request Rejected",
            "Your access request has been rejected. Contact administrative staff if you still wish to gain access.",
            settings.EMAIL_FROM,
            [user.email],
            fail_silently=False,
        )

        return Response("OK", status.HTTP_200_OK)
