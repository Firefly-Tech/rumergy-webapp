from backend.rumergy_backend.rumergy.models import Building
from rest_framework import serializers


class BuildingSerializer(serializers.ModelSerializer):
    """Serializer for building model"""

    meters = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Building
        fields = ["id", "name", "meters"]
