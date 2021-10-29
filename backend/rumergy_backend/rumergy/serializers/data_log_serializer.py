from rest_framework import serializers
from .models.data_points import DataLog

class DataLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataLog
        fields = '__all__'