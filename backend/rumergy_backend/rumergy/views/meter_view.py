from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rumergy_backend.rumergy.serializers import MeterSerializer, MeterDataSerializer
from rumergy_backend.rumergy.models import Meter, MeterData
from dateutil import parser
from django_filters.rest_framework import DjangoFilterBackend


class MeterViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing meter instances."""

    serializer_class = MeterSerializer
    queryset = Meter.objects.all()
    # permission_classes = [permissions.AllowAny] # Only use for testing
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status", "ip", "building"]

    @action(detail=True, methods=["get"])
    def meter_data_by_time_frame(self, request, pk=None):
        """Get data for meter in the given time frame (only data for dashboard view)"""
        try:
            start = parser.isoparse(request.query_params["start"])
            data_type = request.query_params["data_type"]
        except Exception as e:
            return Response("Invalid request format", status.HTTP_400_BAD_REQUEST)
        if (
            data_type.casefold() != "consumption".casefold()
            and data_type.casefold() != "demand".casefold()
        ):
            return Response("Invalid request format", status.HTTP_400_BAD_REQUEST)

        data = MeterData.objects.filter(
            meter=pk, data_point__name__iexact=data_type, timestamp__gte=start
        )
        serializer = MeterDataSerializer(data, many=True)

        return Response(serializer.data, status.HTTP_200_OK)
