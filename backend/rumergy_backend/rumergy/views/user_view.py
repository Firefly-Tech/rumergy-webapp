from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rumergy_backend.rumergy.serializers import UserSerializer, AccessRequestSerializer
from rumergy_backend.rumergy.models import AccessRequest
from django_filters.rest_framework import DjangoFilterBackend


class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD operations on User.
    User profile treated as nested field in User
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["username", "email"]

    @action(detail=False, methods=["get"])
    def get_user_from_auth(self, request, pk=None):
        """Get user info from active auth user"""
        user = request.user
        serializer = UserSerializer(user)

        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def latest_access_request(self, request, pk=None):
        """Get latest access request related to user"""

        try:
            access_req = AccessRequest.objects.filter(user=pk).order_by("-timestamp")[0]
        except:
            return Response("Error", status.HTTP_400_BAD_REQUEST)

        serializer = AccessRequestSerializer(access_req)

        return Response(serializer.data, status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def signup(self, request, pk=None):
        """
        Post to signup. Sets default inactive role.
        """

        try:
            request.data["profile"]["role"] = "INA"
        except KeyError:
            return Response("Invalid format", status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
