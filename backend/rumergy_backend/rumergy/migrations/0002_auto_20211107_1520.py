# Generated by Django 3.2.9 on 2021-11-07 15:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('rumergy', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datalog',
            name='meter',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='data_logs', to='rumergy.meter'),
        ),
        migrations.AlterField(
            model_name='datalog',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='data_logs', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='datapoint',
            name='model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='data_points', to='rumergy.metermodel'),
        ),
    ]
