from rest_framework import serializers
from rumergy_backend.rumergy.models import DataLog
from django.contrib.auth.models import User
from rumergy_backend.rumergy.models.data_log_measures import DataLogMeasures
from rumergy_backend.rumergy.models.meter import Meter

class DataLogSerializer(serializers.ModelSerializer):
    
    meter = serializers.PrimaryKeyRelatedField(many=True, queryset=Meter.objects.all())
    user = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    data_log_measures = serializers.PrimaryKeyRelatedField(may=True, queryset=DataLogMeasures.object.all())
    
    class Meta:
        model = DataLog
        fields = ['start_date', 'end_date', 'meter', 'user', 'data_log_measures'] 