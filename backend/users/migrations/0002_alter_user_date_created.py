# Generated by Django 4.0.1 on 2022-02-10 18:43

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2022, 2, 10, 18, 43, 29, 475922, tzinfo=utc)),
        ),
    ]