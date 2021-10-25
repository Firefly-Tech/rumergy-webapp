from backend.rumergy_backend.rumergy.models import MeterModel
from rest_framework import serializers


class MeterModelSerializer(serializers.ModelSerializer):
    """Serializer for meter model model"""

    class Meta:
        model = MeterModel
        fields = ["id", "name"]  # TODO: Check if need "id"

    def create(self, validated_data):
        """Create and return a new 'MeterModel' instance, given the validated data"""

        return MeterModel.objects.create(**validated_data)  # TODO: Check objects

    def update(self, instance, validated_data):
        """Update and return an existing 'MeterModel' instance, given the validated data"""

        instance.name = validated_data.get("name", instance.name)
        instance.save()
        return instance
