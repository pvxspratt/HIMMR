# Generated by Django 4.0.1 on 2022-03-09 00:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0022_remove_comment_likes_remove_post_likes_like'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='like',
            name='count',
        ),
    ]
