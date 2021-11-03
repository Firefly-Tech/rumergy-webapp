from rumergy_backend.rumergy.models import MeterData
from rest_framework import serializers


class MeterDataSerializer(serializers.ModelSerializer):
    """Serializer for meter data model"""

    class Meta:
        model = MeterData
        fields = ["id", "timestamp", "avg", "min", "max"]
