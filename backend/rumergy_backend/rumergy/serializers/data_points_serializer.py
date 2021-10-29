from rest_framework import serializers
from .models.data_points import DataPoints

class DataPointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataPoints
        fields = '__all__'
