# Generated by Django 3.2 on 2022-04-10 23:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0038_remove_user_auth_provider'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='auth_provider',
            field=models.CharField(blank=True, default='email', max_length=255, null=True),
        ),
    ]