# Generated by Django 3.2.9 on 2021-11-07 23:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rumergy', '0005_alter_meterdata_data_point'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meterdata',
            name='data_point',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='meter_data', to='rumergy.datapoint'),
        ),
    ]
