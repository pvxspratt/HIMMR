# Generated by Django 3.2 on 2022-04-27 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0047_alter_notification_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='type',
            field=models.CharField(choices=[('C', 'Comment'), ('P', 'Post'), ('CR', 'Connection Request')], default='P', max_length=2),
        ),
    ]
