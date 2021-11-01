from backend.rumergy_backend.rumergy.models import DataLogMeasures
from rest_framework import viewsets
from backend.rumergy_backend.rumergy.serializers import DataLogMeasuresSerializer


class DataLogMeasuresViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing data log measures instances."""

    serializer_class = DataLogMeasuresSerializer
    queryset = DataLogMeasures.objects.all()
