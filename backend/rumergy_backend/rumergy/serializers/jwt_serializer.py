from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RumergyObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        # Extra responses
        data["id"] = self.user.id
        data["username"] = self.user.username
        data["role"] = self.user.profile.role

        return data
