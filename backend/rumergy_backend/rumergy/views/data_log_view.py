from rest_framework import viewsets
from rest_framework import permissions
from rumergy_backend.rumergy.serializers.data_log_serializer import DataLogSerializer
from rumergy_backend.rumergy.models.data_log import DataLog
from rumergy_backend.rumergy.models.data_log_measures import DataLogMeasures
from rumergy_backend.rumergy.models.data_point import DataPoint
from rumergy_backend.rumergy.models.meter import Meter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
import csv
from django.http import HttpResponse

class DataLogViewSet(viewsets.ModelViewSet):
    queryset = DataLog.objects.all()
    serializer_class = DataLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.AllowAny] # Only use for testing

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        datalog = DataLog.objects.get(id=pk)
        meter = Meter.objects.get(id=datalog.meter.pk)
        filename = meter.name + "'s Data Log Results"
        datapoints = datalog.data_points
        try:
            measures = DataLogMeasures.objects.filter(data_log=pk).order_by("-timestamp")
        except:
            return Response("Error", status.HTTP_400_BAD_REQUEST)

        # Create the HttpResponse object with the appropriate CSV header.
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="%s.csv"' % filename
        # Create the CSV writer using the HttpResponse as the "file"
        writer = csv.writer(response)
        writer.writerow(["Date", " Data Point", " Value", " Unit"])
        for measure in measures:
            for datapoint in datapoints.all():
                writer.writerow([measure.timestamp, datapoint.name, measure.value, datapoint.unit])
        return response
