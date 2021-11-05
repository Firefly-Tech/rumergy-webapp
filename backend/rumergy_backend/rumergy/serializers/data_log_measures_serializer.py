from rumergy_backend.rumergy.models import DataLogMeasures
from rest_framework import serializers


class DataLogMeasuresSerializer(serializers.ModelSerializer):
    """Serializer for data log measures model"""

    class Meta:
        model = DataLogMeasures
        fields = ["id", "value", "timestamp"]
