from django.db import models
# from . import Model

class DataPoint(models.Model):
    name = models.CharField(max_length=100)
    unit = models.CharField(max_length=10)
    start_address = models.PositiveSmallIntegerField()
    end_address = models.PositiveSmallIntegerField()
    
    INTEGER = 'INT'
    FLOAT = 'FLT'
    DATA_TYPES = [
                (INTEGER, 'Integer'),
                (FLOAT, 'Float'),
                ]
    
    data_type = models.CharField(max_length=3, choices= DATA_TYPES, default=FLOAT)

    COIL = 'COIL'
    DISCRETE = 'DISC'
    INPUT = 'INPU'
    HOLDING = 'HOLD'
    REGISTER_TYPE = [
        (COIL , 'Coil'),
        (DISCRETE , 'Discrete Input'),
        (INPUT , 'Input Register'),
        (HOLDING , 'Holding Register'),
    ] 

    register_type = models.CharField(max_length=4,choices=REGISTER_TYPE, default=HOLDING)   

    # model = models.ForeignKey(Model, related_name='data_points' on_delete=models.PROTECT)
