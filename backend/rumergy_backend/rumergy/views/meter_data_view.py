from rumergy_backend.rumergy.models import MeterData
from rest_framework import viewsets
from rest_framework import permissions
from rumergy_backend.rumergy.serializers import MeterDataSerializer


class MeterDataViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing meter data instances."""

    serializer_class = MeterDataSerializer
    queryset = MeterData.objects.all()
    # permission_classes = [permissions.AllowAny] # Only use for testing
