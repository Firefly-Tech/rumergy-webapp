# Generated by Django 4.0 on 2021-12-09 01:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rumergy', '0015_merge_20211206_0138'),
    ]

    operations = [
        migrations.AddField(
            model_name='datalogmeasures',
            name='status',
            field=models.CharField(choices=[('OK', 'OK'), ('ERR', 'Error')], default='OK', max_length=3),
        ),
    ]
