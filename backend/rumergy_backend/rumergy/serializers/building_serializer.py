from backend.rumergy_backend.rumergy.models import Building
from rest_framework import serializers


class BuildingSerializer(serializers.ModelSerializer):
    """Serializer for building model"""

    class Meta:
        model = Building
        fields = ["id", "name"]  # TODO: Check if need "id"

    def create(self, validated_data):
        """Create and return a new 'Building' instance, given the validated data"""

        return Building.objects.create(**validated_data)  # TODO: Check objects

    def update(self, instance, validated_data):
        """Update and return an existing 'Building' instance, given the validated data"""

        instance.name = validated_data.get("name", instance.name)
        instance.save()
        return instance
