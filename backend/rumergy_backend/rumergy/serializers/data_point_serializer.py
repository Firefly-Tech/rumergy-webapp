from rest_framework import serializers
from rumergy_backend.rumergy.models.data_point import DataPoint


class DataPointSerializer(serializers.ModelSerializer):

    data_logs = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = DataPoint
        fields = [
            "id",
            "model",
            "name",
            "unit",
            "start_address",
            "end_address",
            "data_type",
            "register_type",
            "data_logs",
        ]

