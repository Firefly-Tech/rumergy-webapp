# Generated by Django 3.2.9 on 2021-11-11 07:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rumergy', '0007_auto_20211111_0320'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='datapoint',
            constraint=models.UniqueConstraint(fields=('model', 'name'), name='unique data point name'),
        ),
    ]