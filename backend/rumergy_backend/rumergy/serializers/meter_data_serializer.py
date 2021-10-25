from backend.rumergy_backend.rumergy.models import MeterData
from rest_framework import serializers


class MeterDataSerializer(serializers.ModelSerializer):
    """Serializer for meter data model"""

    class Meta:
        model = MeterData
        fields = ["id", "data_points", "timestamp", "avg", "min", "max"]  # TODO: Check if need "id"

    def create(self, validated_data):
        """Create and return a new 'Meter Data' instance, given the validated data"""

        return MeterData.objects.create(**validated_data)  # TODO: Check objects

    def update(self, instance, validated_data):
        """Update and return an existing 'Meter Data' instance, given the validated data"""

        instance.data_points = validated_data.get("data_points", instance.data_points)
        instance.timestamp = validated_data.get("timestamp", instance.timestamp)
        instance.avg = validated_data.get("avg", instance.avg)
        instance.min = validated_data.get("min", instance.min)
        instance.max = validated_data("max", instance.max)
        instance.save()
        return instance
