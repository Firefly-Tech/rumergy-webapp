from rest_framework import serializers
from rumergy_backend.rumergy.models import DataLog

class DataLogSerializer(serializers.ModelSerializer):
    meters = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    users = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    
    class Meta:
        model = DataLog
        fields = ['start_date', 'end_date', 'meters', 'users']