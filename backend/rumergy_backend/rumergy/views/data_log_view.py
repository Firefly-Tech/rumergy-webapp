from rest_framework import viewsets
from rest_framework import permissions
from rumergy_backend.rumergy.serializers.data_log_serializer import DataLogSerializer
from rumergy_backend.rumergy.models.data_log import DataLog

class DataLogViewSet(viewsets.ModelViewSet):
    queryset = DataLog.objects.all()
    serializer_class = DataLogSerializer
    # permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny] # Only use for testing
