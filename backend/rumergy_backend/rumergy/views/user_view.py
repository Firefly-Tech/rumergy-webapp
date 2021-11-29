from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rumergy_backend.rumergy.serializers import UserSerializer, AccessRequestSerializer, access_request_serializer
from rumergy_backend.rumergy.models import AccessRequest
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q


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


    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def check_existing(self, request, pk=None):
        """Check if user with given username or email exists"""
        try:
            username = request.query_params["username"]
            email = request.query_params["email"]
        except KeyError:
            return Response("Invalid parameters", status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(Q(email=email) | Q(username=username))
        return Response("Found" if list(users) else "Not found", status.HTTP_200_OK)


    @action(detail=False, methods=["get"])
    def get_user_from_auth(self, request, pk=None):
        """Get user info from active auth user"""
        user = request.user
        serializer = UserSerializer(user)

        return Response(serializer.data)

    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def latest_access_request(self, request, pk=None):
        """Get latest access request related to user"""

        try:
            access_req = AccessRequest.objects.filter(user=pk).order_by("-timestamp")[0]
        except:
            return Response("Error", status.HTTP_400_BAD_REQUEST)

        serializer = AccessRequestSerializer(access_req)

        return Response(serializer.data, status.HTTP_200_OK)

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def signup(self, request, pk=None):
        """
        Post to signup. Sets default inactive role.
        """

        try:
            request.data["profile"]["role"] = "INA"
            access_request_data = {
                "occupation": request.data.pop("occupation"),
                "justification": request.data.pop("justification"),
            }
        except KeyError:
            return Response("Invalid format", status=status.HTTP_400_BAD_REQUEST)

        user_serializer = UserSerializer(data=request.data)
        if not user_serializer.is_valid():
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_serializer.save()
        try:
            access_request_data["user"] = user_serializer.data["id"]
        except KeyError:
            return Response("Error", status=status.HTTP_400_BAD_REQUEST)

        access_request_serializer = AccessRequestSerializer(data=access_request_data)
        if not access_request_serializer.is_valid():
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        access_request_serializer.save()

        return Response("OK", status=status.HTTP_201_CREATED)
