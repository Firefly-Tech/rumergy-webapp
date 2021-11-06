from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken
from rumergy_backend.rumergy.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD operations on User.
    User profile treated as nested field in User
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.AllowAny] # Only use for testing

    @action(detail=False, methods=["get"])
    def get_user_from_auth(self, request, pk=None):
        """Get user info from active auth user"""
        user = request.user
        serializer = UserSerializer(user)

        return Response(serializer.data)
