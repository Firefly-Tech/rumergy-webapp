from pymodbus.client.sync import ModbusTcpClient as ModbusClient
from pymodbus.payload import BinaryPayloadDecoder
from pymodbus.constants import Endian
import requests


def connect_meter(ip, port):

    client = ModbusClient(ip, port=port)
   
    if not client.connect():
        print("Error!. Attempting 3 more tries!")
        attempts = 3
        while not client.connect() and attempts > 0:
            attempts = attempts - 1
    
        print(f"Fail to connect to meter with ip address: {ip}")
            #TODO set meter status to Inactive 
    else:
        return client  
    

'''Parameters given comes from a JSON parse of django models data '''
'''TODO Add decoder inside '''
def read_point(client, regtype, start_address, end_address):
    count = end_address - start_address + 1
    if regtype == 'HOLD':
        result = client.read_holding_registers(start_address, count, unit=0x01)
    elif regtype == 'DISC':
        result = client.read_discrete_inputs(start_address, count, unit=0x01)
    elif regtype == 'INPU':
        result = client.read_input_registers(start_address, count, unit=0x01)
    else:
        result  = client.read_coils(start_address, count, unit=0x01)
    
    return result


#TODO add option for integer type
def decode_message(result):
    decoder = BinaryPayloadDecoder.fromRegisters(result.registers, byteorder=Endian.Big, wordorder=Endian.Big)
    return decoder.decode_32bit_float()


def data_logger():
'''Get data logs entries '''
    meters = requests.get('http://127.0.0.1:8000/api/meters/').json()
    for meter in meters:
        
        '''data_log_ids contains the pks of all data logs records/requests related to a meter '''
        data_logs_ids = meter['data_logs']

        '''Search each data_log record related to each pk '''
        for log_id in data_logs_ids:
            data_log_record = requests.get(f'http://127.0.0.1:8000/api/data-logs/{log_id}')
            
            '''TODO: Verify that data log is not in progress or have not been scheduled already '''
            start_date = data_log_record['start_date']
            end_date = data_log_record['end_date']

            # if now() > end_date: continue
            # if now() < end_date and now() > start_date: log is supposed to be in progress. continue

            data_points = data_log_record['data_points']



