from backend.rumergy_backend.rumergy.models import Building
from rest_framework import viewsets
from backend.rumergy_backend.rumergy.serializers import BuildingSerializer


class BuildingViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing building instances."""

    serializer_class = BuildingSerializer
    queryset = Building.objects.all()  # TODO: Check if need permissions and check objects
