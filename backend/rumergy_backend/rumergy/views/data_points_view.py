from rest_framework import viewsets
from rest_framework.response import Response
from rumergy_backend.rumergy.serializers.data_points_serializer import DataPointsSerializer
from rumergy_backend.rumergy.models.data_points import DataPoints

class DataPointViewSet(viewsets.ModelViewSet):
    queryset = DataPoints.objects.all()
    serializer_class = DataPointsSerializer

