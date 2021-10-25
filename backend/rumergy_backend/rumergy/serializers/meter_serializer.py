from backend.rumergy_backend.rumergy.models import Meter
from rest_framework import serializers


class MeterSerializer(serializers.ModelSerializer):
    """Serializer for meter model"""

    class Meta:
        model = Meter
        fields = ["id", "name", "meter_model", "building", "ip", "port", "substation", "coordinates",
                  "comments", "panel_id", "serial_number"]  # TODO: Check if need "id"

    def create(self, validated_data):
        """Create and return a new 'Meter' instance, given the validated data"""

        return Meter.objects.create(**validated_data)  # TODO: Check objects

    def update(self, instance, validated_data):
        """Update and return an existing 'Meter' instance, given the validated data"""

        instance.name = validated_data.get("name", instance.name)
        instance.meter_model = validated_data.get("meter_model", instance.meter_model)
        instance.building = validated_data.get("building", instance.building)
        instance.ip = validated_data.get("ip", instance.ip)
        instance.port = validated_data("port", instance.port)
        instance.substation = validated_data("substation", instance.substation)
        instance.coordinates = validated_data("coordinates", instance.coordinates)
        instance.comments = validated_data("comments", instance.comments)
        instance.panel_id = validated_data("panel_id", instance.panel_id)
        instance.serial_number = validated_data("serial_number", instance.serial_number)
        instance.save()
        return instance
