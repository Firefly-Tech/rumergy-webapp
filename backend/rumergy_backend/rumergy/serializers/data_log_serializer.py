from rest_framework import serializers
from rumergy_backend.rumergy.models import DataLog
from rumergy_backend.rumergy.models.data_log_measures import DataLogMeasures

class DataLogSerializer(serializers.ModelSerializer):

    data_log_measures = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = DataLog
        fields = ["id", "meter", "user", "start_date", "end_date", "data_log_measures"]
