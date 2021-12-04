from rumergy_backend.rumergy.models import MeterModel
from rest_framework import viewsets
from rest_framework import permissions
from rumergy_backend.rumergy.serializers import MeterModelSerializer


class MeterModelViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing meter model instances."""

    serializer_class = MeterModelSerializer
    queryset = MeterModel.objects.all()
    # permission_classes = [permissions.AllowAny] # Only use for testing
