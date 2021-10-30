from rest_framework import serializers
from rumergy_backend.rumergy.models.data_points import DataPoints
# from rumergy_backend.rumergy.models.model import Model

class DataPointsSerializer(serializers.ModelSerializer):
    model = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = DataPoints
        fields = ['name', 'unit', 'start_address', 'end_address', 'data_type', 'register_type', 'model']
