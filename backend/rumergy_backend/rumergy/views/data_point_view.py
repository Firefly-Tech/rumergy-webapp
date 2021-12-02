from rest_framework import viewsets
from rest_framework import permissions
from rumergy_backend.rumergy.serializers.data_point_serializer import DataPointSerializer
from rumergy_backend.rumergy.models.data_point import DataPoint

class DataPointViewSet(viewsets.ModelViewSet):
    queryset = DataPoint.objects.all()
    serializer_class = DataPointSerializer
    # permission_classes = [permissions.AllowAny] # Only use for testing
