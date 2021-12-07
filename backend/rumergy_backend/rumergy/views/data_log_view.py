from django.utils.timezone import now
from rest_framework import viewsets
from rest_framework import permissions
from rumergy_backend.rumergy.serializers.data_log_serializer import DataLogSerializer
from rumergy_backend.rumergy.models.data_log import DataLog
from rumergy_backend.rumergy.models.data_log_measures import DataLogMeasures
from rumergy_backend.rumergy.models.meter import Meter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse

from datetime import datetime, timedelta, timezone
import requests
import csv
from dateutil.parser import isoparse

import modbus.modbus_client as Modbus
from modbus.singleton import SchedulerHandler




class DataLogViewSet(viewsets.ModelViewSet):
    queryset = DataLog.objects.all()
    serializer_class = DataLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.AllowAny] # Only use for testing

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        datalog = DataLog.objects.get(id=pk)
        if datalog.end_date > now():
            return Response("This data log has not finished yet", status.HTTP_400_BAD_REQUEST)
        meter = Meter.objects.get(id=datalog.meter.pk)
        filename = meter.name + "'s Data Log Results"

        try:
            measures = DataLogMeasures.objects.filter(data_log=pk).order_by("-timestamp")
        except:
            return Response("Error", status.HTTP_400_BAD_REQUEST)

        # Create the HttpResponse object with the appropriate CSV header.
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="%s.csv"' % filename
        # Create the CSV writer using the HttpResponse as the "file"
        writer = csv.writer(response)
        writer.writerow(["Date and Time", "Data Point", "Value", "Unit"])
        for measure in measures:
            writer.writerow([measure.timestamp.strftime("%m/%d/%Y, %H:%M:%S"), measure.data_point.name,
                             measure.value, measure.data_point.unit])
        return response

    def perform_create(self, serializer):
        super().perform_create(serializer)
        log_id = serializer.data['id']
        meter = serializer.data['meter']
        start_date = serializer.data['start_date']
        end_date = serializer.data['end_date']
        points = serializer.data['data_points']
        sampling = serializer.data['sampling_rate']
         
        # start_date_formated = datetime.strptime(f'{start_date}',"%Y-%m-%dT%H:%M:%SZ")
        start_date_formated = isoparse(start_date)
        start_date_formated = start_date_formated + timedelta(hours=4)
        # end_date_formated = datetime.strptime(f'{end_date}',"%Y-%m-%dT%H:%M:%SZ")
        # end_date_formated = end_date_formated + timedelta(hours=4)
        end_date_formated = isoparse(end_date)
        end_date_formated = end_date_formated + timedelta(hours=4)
        scheduler = SchedulerHandler().retrieve_scheduler()

        job = scheduler.add_job(read_points_list, trigger='interval', jobstore='djangojobstore', next_run_time=start_date_formated, seconds=sampling,
        args=[log_id, meter, points])  
        print(job.id)
        end_job = scheduler.add_job(delete_job, trigger='date', jobstore='djangojobstore', run_date=end_date_formated, args=[job.id])



def read_points_list(log_id, meter_id, points_list):
    # headers={"Authorization": f"Bearer {access_token}"}
    access_token, refresh_token = Modbus.get_token()

    meter_record = requests.get(f'http://127.0.0.1:8000/api/meters/{meter_id}/', headers={"Authorization": f"Bearer {access_token}"}).json()
    meter_ip = meter_record['ip']
    meter_port = meter_record['port']

    for point in points_list:
        data_point = requests.get(f'http://127.0.0.1:8000/api/data-points/{point}/', headers={"Authorization": f"Bearer {access_token}"}).json()
        start_address = data_point['start_address']
        end_address = data_point['end_address']
        data_type = data_point['data_type']
        regtype = data_point['register_type']

        meter = Modbus.connect_meter(meter_ip, meter_port)
        result = Modbus.decode_message(Modbus.read_point(meter, regtype, start_address, end_address), data_type)
        meter.close()
        print(result)
        timestamp = datetime.now(timezone.utc)
        log_dict = {"data_log": f"{log_id}", "data_point": f"{point}", "value": f"{result}", "timestamp": f"{timestamp}"}
        post = requests.post('http://127.0.0.1:8000/api/data-log-measures/', headers={"Authorization": f"Bearer {access_token}"}, json=log_dict)
        



def delete_job(job_id):
    scheduler = SchedulerHandler().retrieve_scheduler()
    scheduler.remove_job(job_id)
