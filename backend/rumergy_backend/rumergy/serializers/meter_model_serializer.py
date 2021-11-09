from rumergy_backend.rumergy.models import MeterModel
from rest_framework import serializers


class MeterModelSerializer(serializers.ModelSerializer):
    """Serializer for meter model model"""

    meters = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    data_points = serializers.PrimaryKeyRelatedField(many=True, read_only=True)


    class Meta:
        model = MeterModel
        fields = ["id", "name", "meters", "data_points"]
