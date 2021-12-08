from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rumergy_backend.rumergy.serializers import MeterSerializer, MeterDataSerializer
from rumergy_backend.rumergy.models import Meter, MeterData, DataPoint
from dateutil import parser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
import modbus.modbus_client as Modbus


class MeterViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing meter instances."""

    serializer_class = MeterSerializer
    queryset = Meter.objects.all()
    # permission_classes = [permissions.AllowAny] # Only use for testing
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["status", "ip", "building"]
    ordering_fields = ["building__name"]

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

    @action(
        detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated]
    )
    def live_reading(self, request, pk=None):
        """Get reading from specified meter and datapoint"""

        data_point_id = request.query_params["datapoint"]

        meter_obj = Meter.objects.get(pk=pk)
        ip = meter_obj.ip
        port = meter_obj.port

        data_point = DataPoint.objects.get(pk=data_point_id)
        start_address = data_point.start_address
        end_address = data_point.end_address
        regtype = data_point.register_type
        data_type = data_point.data_type

        meter = Modbus.connect_meter(ip, port)
        result = Modbus.decode_message(
            Modbus.read_point(meter, regtype, start_address, end_address), data_type
        )

        return Response(
            {
                "meter": f"{pk}",
                "data_point": f"{data_point_id}",
                "value": f"{result}",
            },
            status.HTTP_200_OK,
        )
