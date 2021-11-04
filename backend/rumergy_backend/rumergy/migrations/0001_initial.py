# Generated by Django 3.2.9 on 2021-11-03 23:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Building',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60)),
            ],
        ),
        migrations.CreateModel(
            name='DataLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Meter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('port', models.IntegerField(default=502)),
                ('substation', models.CharField(max_length=60)),
                ('longitude', models.FloatField()),
                ('latitude', models.FloatField()),
                ('comments', models.CharField(max_length=200)),
                ('panel_id', models.CharField(max_length=60)),
                ('serial_number', models.CharField(max_length=100)),
                ('status', models.CharField(choices=[('ACT', 'Active'), ('INA', 'Inactive')], default='ACT', max_length=3)),
                ('building', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='meters', to='rumergy.building')),
            ],
        ),
        migrations.CreateModel(
            name='MeterModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=30, verbose_name='first name')),
                ('last_name', models.CharField(max_length=60, verbose_name='last name')),
                ('role', models.CharField(choices=[('ADM', 'Admin'), ('ADV', 'Advanced'), ('INA', 'Inactive')], default='INA', max_length=3)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MeterData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('avg', models.FloatField()),
                ('min', models.FloatField()),
                ('max', models.FloatField()),
                ('meter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meter_data', to='rumergy.meter')),
            ],
        ),
        migrations.AddField(
            model_name='meter',
            name='meter_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='meters', to='rumergy.metermodel'),
        ),
        migrations.CreateModel(
            name='DataLogMeasures',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.FloatField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('data_log', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='data_log_measures', to='rumergy.datalog')),
            ],
        ),
        migrations.AddField(
            model_name='datalog',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='rumergy.userprofile'),
        ),
        migrations.CreateModel(
            name='AccessRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('occupation', models.CharField(default='None', max_length=20)),
                ('justification', models.CharField(default='No justification provided', max_length=200)),
                ('status', models.CharField(choices=[('ACT', 'Active'), ('ACC', 'Accepted'), ('REJ', 'Rejected')], default='ACT', max_length=3)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='access_request', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
