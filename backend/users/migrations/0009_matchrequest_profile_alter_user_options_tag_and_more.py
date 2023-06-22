# Generated by Django 4.0.1 on 2022-02-22 18:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_user_is_admin_user_is_staff'),
    ]

    operations = [
        migrations.CreateModel(
            name='MatchRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('picture', models.ImageField(blank=True, upload_to='', verbose_name='Profile Picture')),
            ],
        ),
        migrations.AlterModelOptions(
            name='user',
            options={'get_latest_by': ['-date_created'], 'ordering': ['username']},
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.profile')),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.AddField(
            model_name='profile',
            name='auth_user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Auth User'),
        ),
        migrations.AddField(
            model_name='profile',
            name='blocked_users',
            field=models.ManyToManyField(blank=True, null=True, to='users.Profile', verbose_name='Blocked Users'),
        ),
        migrations.AddField(
            model_name='profile',
            name='matches',
            field=models.ManyToManyField(blank=True, null=True, to='users.Profile', verbose_name='Matches'),
        ),
    ]
