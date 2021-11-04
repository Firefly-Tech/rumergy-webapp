from rest_framework import serializers
from rumergy_backend.rumergy.models import DataLog
from django.contrib.auth.models import User

class DataLogSerializer(serializers.ModelSerializer):
    
    # meter = serializers.PrimaryKeyRelatedField(many=True, queryset=Meter.objects.all())
    user = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    # TODO: Import Meter model
    
    class Meta:
        model = DataLog
        fields = ['start_date', 'end_date', 'meter', 'user']