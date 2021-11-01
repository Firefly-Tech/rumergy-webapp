from rest_framework import serializers
from rumergy_backend.rumergy.models.data_point import DataPoint
# from rumergy_backend.rumergy.models.model import Model

class DataPointSerializer(serializers.ModelSerializer):
    model = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = DataPoint
        fields = ['name', 'unit', 'start_address', 'end_address', 'data_type', 'register_type', 'model']
