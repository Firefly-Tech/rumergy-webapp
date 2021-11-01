from django.db import models
from . import DataLog
# from . import DataPoints

# TODO: Add relationships


class DataLogMeasures(models.Model):
    """Data log measures model"""

    value = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    data_log = models.ForeignKey(DataLog, related_name='data_log_measures', on_delete=models.RESTRICT)
    # data_points = models.ForeignKey(DataPoints, related_name='data_log_measures', on_delete=models.RESTRICT)
    # TODO: Remove Comments
