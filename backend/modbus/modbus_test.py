import modbus_client as modbus
import requests


ip_test = '192.168.1.18'
# port = 502
# meter = modbus.connect_meter(ip_test, port)
# consumption_start = 256
# consumption_end = 257

# result = modbus.decode_message(modbus.read_point(meter, 'HOLD', consumption_start, consumption_end), 'FLT')

# print(result)
access_token, refresh_token = modbus.get_token()
newip = requests.patch('http://127.0.0.1:8000/api/meters/1/',headers={"Authorization": f"Bearer {access_token}"} ,data={"status": f"ACT"}).json()
print(newip)

