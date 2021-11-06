from rumergy_backend.rumergy.models import Meter
from rest_framework import serializers


class MeterSerializer(serializers.ModelSerializer):
    """Serializer for meter model"""

    meter_data = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Meter
        fields = ["id", "name", "ip", "port", "substation", "longitude", "latitude",
            "comments", "panel_id", "serial_number", "status", "meter_data"]
