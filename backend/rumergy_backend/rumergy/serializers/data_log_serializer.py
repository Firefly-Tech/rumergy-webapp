from rest_framework import serializers
from rumergy_backend.rumergy.models import DataLog, DataPoint


class DataLogSerializer(serializers.ModelSerializer):

    data_log_measures = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    data_points = serializers.PrimaryKeyRelatedField(
        queryset=DataPoint.objects.all(), many=True
    )

    class Meta:
        model = DataLog
        fields = [
            "id",
            "meter",
            "user",
            "start_date",
            "end_date",
            "data_log_measures",
            "data_points",
        ]
