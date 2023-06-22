# Generated by Django 4.0.1 on 2022-02-23 15:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0015_alter_profile_auth_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blockrequest',
            name='block_receiver',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='block_receiver', to='users.profile', verbose_name='Block Request Receiver'),
        ),
        migrations.AlterField(
            model_name='blockrequest',
            name='block_sender',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='block_sender', to='users.profile', verbose_name='Block Request Sender'),
        ),
        migrations.AlterField(
            model_name='matchrequest',
            name='match_receiver',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='match_receiver', to='users.profile', verbose_name='Match Request Receiver'),
        ),
        migrations.AlterField(
            model_name='matchrequest',
            name='match_sender',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='match_sender', to='users.profile', verbose_name='Match Request Sender'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='bio',
            field=models.TextField(blank=True, max_length=500, null=True, verbose_name='Bio'),
        ),
    ]
