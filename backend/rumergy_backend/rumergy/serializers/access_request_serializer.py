from backend.rumergy_backend.rumergy.models import AccessRequest
from rest_framework import serializers


class AccessRequestSerializer(serializers.ModelSerializer):
    """Serializer for access request model"""

    class Meta:
        model = AccessRequest
        fields = ["id", "user", "timestamp", "occupation", "justification"]
