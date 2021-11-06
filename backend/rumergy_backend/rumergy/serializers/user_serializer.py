from django.contrib.auth.models import User
from rumergy_backend.rumergy.models import UserProfile, AccessRequest
from rest_framework import serializers


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile model"""

    class Meta:
        model = UserProfile
        fields = ["first_name", "last_name", "role"]


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user model"""

    profile = UserProfileSerializer()
    access_request = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    # data_logs = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    # TODO: Uncomment on merge

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "profile", "access_request"]
        # fields = ["id", "username", "email", "password", "profile", "access_request", "data_logs"]
        # TODO: Uncomment on merge
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        profile_data = validated_data.pop("profile")
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        UserProfile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile")
        profile = instance.profile

        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.set_password(validated_data.get("password", instance.password))
        instance.save()

        profile.first_name = profile_data.get("first_name", profile.first_name)
        profile.last_name = profile_data.get("last_name", profile.last_name)
        profile.role = profile_data.get("role", profile.role)
        profile.save()

        return instance
