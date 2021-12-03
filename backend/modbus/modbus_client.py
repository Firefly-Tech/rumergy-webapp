from pymodbus.client.sync import ModbusTcpClient as ModbusClient
from pymodbus.payload import BinaryPayloadDecoder
from pymodbus.constants import Endian
import requests
from decouple import config
from datetime import datetime



def get_token():
    '''
    get_token(): Function that generates access and refresh tokens for authentication and access to API data

    returns:
        access_token: Has an expiration time of 5 minutes.
        refresh_token: Token used for generating a new access_token after expiration. refresh_token has expiration time of 24hrs.
    '''
    token = requests.post('http://127.0.0.1:8000/api/token/', data={"username": f"{config('USERNAME')}", "password": f"{config('PASSWORD')}"}).json()
    access_token = token['access']
    refresh_token = token['refresh']
    return access_token, refresh_token


def connect_meter(ip, port):

    ''' 
    connect_meter():
    Params:
        ip-
        port-
    '''

    meter = ModbusClient(ip, port=port, retries=3)
   
    if not meter.connect():
     
        print(f"Fail to connect to meter with ip address: {ip}")  
           # Set meter status to ERROR  
        
        try:
            access_token, refresh_token = get_token()
            err_meter = requests.get(f'http://127.0.0.1:8000/api/meters/?ip={ip}', headers={"Authorization": f"Bearer {access_token}"}).json()
            # Assumes unique IP per meter
            err_id = err_meter[0]['id']
            error_status = requests.patch(f'http://127.0.0.1:8000/api/meters/{err_id}/', headers={"Authorization": f"Bearer {access_token}"}, data={"status": "ERR"}).json()
        except Exception as e:
            print("Error updating meter status", e)
    else:
        return meter  
    


def read_point(meter, regtype, start_address, end_address):
    '''read_point(): reads any data point given the client, addresses and register type
        Params:
            client - Represents a connectec device via ModbusTCP protocol

            regtype - The type of the register according to the Modbus specificastion. Could be a coil, 
                        holding register, input register or discrete input register

            start_address - The start address of the data point to read as represented in the Modbus Point Map

            end_address - The end address of the data point to read as represented in the Modbus Point Map.

        returns - Returns the result of the reading obtained from the registers of the given meter.
                The result could be one or more registers, representing a 16-bit integer value or a 
                32-bit floating point value
    '''
    count = end_address - start_address + 1
    
    try:
        if regtype == 'HOLD':
            result = meter.read_holding_registers(start_address, count, unit=0x01)
            if result.isError():
                print('Modbus Error:', result)
        elif regtype == 'DISC':
            result = meter.read_discrete_inputs(start_address, count, unit=0x01)
        elif regtype == 'INPU':
            result = meter.read_input_registers(start_address, count, unit=0x01)
        else:
            result  = meter.read_coils(start_address, count, unit=0x01)
        
        return result

    except Exception as e:
        print("Error reading register", e)
    


def decode_message(result, data_type):
    '''
    decode_message(): Decodes the given result using the PayloadDecoder of the pymodbus moduel.
    Params:
        result - Represents the value obtained from reading a modbus register from a device.

        data_type - Represents the expected data type of the given result. Could be a 16-bit integer or a 32- bit
                    floating point value.

    returns: Returns the decoded value in the specified data type format.
    '''

    decoder = BinaryPayloadDecoder.fromRegisters(result.registers, byteorder=Endian.Big, wordorder=Endian.Big)

    if(data_type == 'INT'):
        return decoder.decode_16bit_int()
    else:
        return decoder.decode_32bit_float()


# def read_points_list(meter_id, points_list):
#     meter_record = requests.get(f'http://127.0.0.1:8000/api/meters/{meter_id}/').json()
#     meter_ip = meter_record['ip']
#     meter_port = meter_record['port']
#     meter = connect_meter(meter_ip, meter_port)
#     for point in points_list:
#         data_point = requests.get(f'http://127.0.0.1:8000/api/data-points/{point}/').json()
#         start_address = data_point['start_address']
#         end_address = data_point['end_address']
#         data_type = data_point['data_type']
#         regtype = data_point['register_type']



#         result = decode_message(read_point(meter, regtype, start_address, end_address), data_type)
#         print(result)



# read_points_list(1, [1,2])=