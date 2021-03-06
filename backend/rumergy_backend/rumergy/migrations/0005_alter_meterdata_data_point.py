# Generated by Django 3.2.9 on 2021-11-07 23:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rumergy', '0004_alter_userprofile_first_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meterdata',
            name='data_point',
            field=models.ForeignKey(limit_choices_to={'meter': models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meter_data', to='rumergy.meter')}, on_delete=django.db.models.deletion.RESTRICT, related_name='meter_data', to='rumergy.datapoint'),
        ),
    ]
