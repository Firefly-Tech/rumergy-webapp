from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RumergyObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        # Extra responses
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "role": self.user.profile.role,
        }

        return data
