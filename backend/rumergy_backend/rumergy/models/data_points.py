from django.db import models

class DataPoints(models.Model):
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
    
    data_type = models.CharField(max_length=3, choices= DATA_TYPES, default=INTEGER)

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

    # model = models.ForeignKey(Model, on_delete=models.PROTECT)