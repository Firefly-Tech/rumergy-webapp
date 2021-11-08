from django.contrib import admin
from rumergy_backend.rumergy import models

# Register your models here.

admin.site.register(models.UserProfile)
admin.site.register(models.Meter)
admin.site.register(models.MeterModel)
admin.site.register(models.DataPoint)
admin.site.register(models.Building)
admin.site.register(models.MeterData)
