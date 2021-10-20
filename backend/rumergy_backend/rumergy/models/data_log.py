from django.db import models
from . import User

class DataLog(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    # meter = models.ForeignKey(Meter, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
