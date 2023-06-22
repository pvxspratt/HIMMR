# Generated by Django 4.0.1 on 2022-03-09 01:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0026_remove_like_profile liked by_and_more'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='like',
            constraint=models.UniqueConstraint(fields=('post', 'related_profile'), name='Profile Liked By'),
        ),
        migrations.AddConstraint(
            model_name='like',
            constraint=models.UniqueConstraint(fields=('comment', 'related_profile'), name='Comment Liked By'),
        ),
    ]