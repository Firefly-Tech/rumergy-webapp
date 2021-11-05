from rumergy_backend.rumergy.models import Meter
from rest_framework import viewsets
from rest_framework import permissions
from rumergy_backend.rumergy.serializers import MeterSerializer


class MeterViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing meter instances."""

    serializer_class = MeterSerializer
    queryset = Meter.objects.all()
    # permission_classes = [permissions.AllowAny] # Only use for testing
