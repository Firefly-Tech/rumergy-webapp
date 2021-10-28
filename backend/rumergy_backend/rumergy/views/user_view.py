from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework import permissions
from rumergy_backend.rumergy.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD operations on User.
    User profile treated as nested field in User
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
