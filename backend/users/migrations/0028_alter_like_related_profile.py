# Generated by Django 4.0.1 on 2022-03-09 02:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0027_like_profile liked by_like_comment liked by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='related_profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='related_profile', to='users.profile'),
        ),
    ]
