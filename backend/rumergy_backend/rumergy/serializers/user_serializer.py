from django.contrib.auth.models import User
from rumergy_backend.rumergy.models import UserProfile
from rest_framework import serializers


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile model"""

    class Meta:
        model = UserProfile
        fields = ["first_name", "last_name", "role"]


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user model"""

    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "profile"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        profile_data = validated_data.pop("profile")
        user = User.objects.create(**validated_data)
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
