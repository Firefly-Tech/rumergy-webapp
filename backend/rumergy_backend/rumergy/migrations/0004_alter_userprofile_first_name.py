# Generated by Django 3.2.9 on 2021-11-07 23:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rumergy', '0003_alter_meter_comments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='first_name',
            field=models.CharField(max_length=50, verbose_name='first name'),
        ),
    ]