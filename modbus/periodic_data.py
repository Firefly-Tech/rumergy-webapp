import modbus_client as client
import requests


''' This function should have access to the list of meters.
    For each meter, it should attempt connection and read two data points each 15 minutes:
    energy consumption (kWh) and energy demand (kW)
'''        

def periodic_data():
    
    access_token, refresh_token = client.get_token()
    
    '''Get meter list '''
    meters = requests.get('http://127.0.0.1:8000/api/meters/', headers={"Authorization": f"Bearer {access_token}"}).json()

    for meter in meters:
        model_id = meter['meter_model']
        
        model_record = requests.get(f'http://127.0.0.1:8000/api/meter-models/{model_id}', headers={"Authorization": f"Bearer {access_token}"}).json()
        
        for point_pk in model_record['data_points']:
            point_record = requests.get(f'http://127.0.0.1:8000/api/data-points/{point_pk}', headers={"Authorization": f"Bearer {access_token}"}).json()

            if point_record['name'] == 'Energy Consumption' or point_record['name'] == 'Energy Demand':
                start_address = point_record['start_address']
                end_address = point_record['end_address']
                regtype = point_record['register_type']
                
                try:
                    c = client.connect_meter(meter['ip'], meter['port'])
                    reading = client.decode_message(client.read_point(c, regtype, start_address, end_address))  
                    post_dict = {
                        "data_point": f"{point_pk}",
                        "meter": f"{meter['id']}",
                        "avg": f"{reading}",
                        "min": f"{reading}",
                        "max": f"{reading}"
                    }
                    response = requests.post('http://127.0.0.1:8000/api/meter-data/', headers={"Authorization": f"Bearer {access_token}"}, json=post_dict)
                    
                    ''' raise_for_status() raises http errors'''
                    response.raise_for_status()
                    print(response.status_code)
                    c.close()

                except:
                    print(f"Connection Unsuccessfull to IP = {meter['ip']} ")



if __name__ == "__main__":
    periodic_data()