from rest_framework import viewsets
from rest_framework.response import Response
from rumergy_backend.rumergy.serializers.data_log_serializer import DataLogSerializer
from rumergy_backend.rumergy.models.data_log import DataLog

class DataLogViewSet(viewsets.ModelViewSet):
    queryset = DataLog.objects.all()
    serializer_class = DataLogSerializer
    
