# Generated by Django 3.2.9 on 2021-11-18 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rumergy', '0010_merge_20211111_2020'),
    ]

    operations = [
        migrations.AddField(
            model_name='datalog',
            name='sampling_rate',
            field=models.PositiveIntegerField(default=3),
        ),
    ]
