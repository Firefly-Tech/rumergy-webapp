from rumergy_backend.rumergy.models import MeterModel
from rest_framework import serializers


class MeterModelSerializer(serializers.ModelSerializer):
    """Serializer for meter model model"""

    meters = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    # data_points= serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    # TODO: Reminder that data_points relation goes here, not in data_points itself


    class Meta:
        model = MeterModel
        fields = ["id", "name", "meters"]
        #fields = ["id", "name", "meters", "data_points"]
        # TODO: Replace ields when data_point model is added
