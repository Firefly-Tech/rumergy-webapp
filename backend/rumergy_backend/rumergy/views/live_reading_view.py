from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import requests
import modbus.modbus_client as Modbus

@api_view(['GET'])
@permission_classes([AllowAny])
def live_read(request):
    meter_param = request.query_params['meter']
    data_point_param = request.query_params['datapoint']

    meter_record = requests.get(f'http://127.0.0.1:8000/api/meters/{meter_param}/').json()
    ip = meter_record['ip']
    port = meter_record['port']

    data_point_record = requests.get(f'http://127.0.0.1:8000/api/data-points/{data_point_param}/').json()
    start_address = data_point_record['start_address']
    end_address = data_point_record['end_address']
    regtype = data_point_record['register_type']
    data_type = data_point_record['data_type']

    meter = Modbus.connect_meter(ip, port)
    result = Modbus.decode_message(Modbus.read_point(meter, regtype, start_address, end_address), data_type)

    return Response({"meter": f"{meter_param}", "data_point": f"{data_point_param}", "value": f"{result}"})

    # /get-reading?meter={id}&datapoint={id}