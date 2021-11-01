from rest_framework_simplejwt.views import TokenObtainPairView
from rumergy_backend.rumergy.serializers import RumergyObtainPairSerializer


class RumergyObtainPairView(TokenObtainPairView):
    serializer_class = RumergyObtainPairSerializer
