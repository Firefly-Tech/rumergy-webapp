import csv

from dateutil.parser import isoparse
from decouple import config
from django.http import HttpResponse
from django.utils.timezone import now
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
import rpyc
from rest_framework import permissions
from rumergy_backend.rumergy.models.data_log import DataLog
from rumergy_backend.rumergy.models.data_log_measures import DataLogMeasures
from rumergy_backend.rumergy.models.meter import Meter
from rumergy_backend.rumergy.serializers.data_log_serializer import DataLogSerializer


class DataLogViewSet(viewsets.ModelViewSet):
    queryset = DataLog.objects.all()
    serializer_class = DataLogSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["user"]
    # permission_classes = [permissions.AllowAny] # Only use for testing

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        datalog = DataLog.objects.get(id=pk)
        if datalog.end_date > now():
            return Response(
                "This data log has not finished yet", status.HTTP_400_BAD_REQUEST
            )
        meter = Meter.objects.get(id=datalog.meter.pk)
        filename = meter.name + "'s Data Log Results"

        try:
            measures = DataLogMeasures.objects.filter(data_log=pk).order_by(
                "-timestamp"
            )
        except:
            return Response("Error", status.HTTP_400_BAD_REQUEST)

        # Create the HttpResponse object with the appropriate CSV header.
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="%s.csv"' % filename
        # Create the CSV writer using the HttpResponse as the "file"
        writer = csv.writer(response)
        writer.writerow(
            ["Date and Time", "Data Point", "Value", "Unit", "Reading Status"]
        )
        for measure in measures:
            writer.writerow(
                [
                    measure.timestamp.strftime("%m/%d/%Y, %H:%M:%S"),
                    measure.data_point.name,
                    measure.value,
                    measure.data_point.unit,
                    measure.status,
                ]
            )
        return response

    def perform_create(self, serializer):
        super().perform_create(serializer)

        log_id = serializer.data["id"]
        meter = serializer.data["meter"]
        start_date = serializer.data["start_date"]
        end_date = serializer.data["end_date"]
        points = serializer.data["data_points"]
        sampling = serializer.data["sampling_rate"]

        start_date_formated = isoparse(start_date).strftime("%Y-%m-%d %H:%M:%S")
        end_date_formated = isoparse(end_date).strftime("%Y-%m-%d %H:%M:%S")

        host = config("SCHED_SERVER_HOST")
        port = config("SCHED_SERVER_PORT")

        conn = rpyc.connect(
            host,
            port,
            config={"allow_public_attrs": True},
        )
        job = conn.root.add_job(
            "server:read_points_list",
            "interval",
            args=[log_id, meter, tuple(points)],
            seconds=sampling,
            start_date=start_date_formated,
            end_date=end_date_formated,
        )
