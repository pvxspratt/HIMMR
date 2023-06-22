# Generated by Django 4.0.1 on 2022-03-11 14:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0029_alter_comment_post'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='address',
            field=models.OneToOneField(default='', on_delete=django.db.models.deletion.CASCADE, related_name='listing', to='users.address'),
        ),
        migrations.AddField(
            model_name='listing',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='listing',
            name='name',
            field=models.CharField(default='My apartment', max_length=250),
        ),
        migrations.AlterField(
            model_name='address',
            name='country',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Country'),
        ),
        migrations.AlterField(
            model_name='address',
            name='profile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='addresses', to='users.profile', verbose_name='Profile Address'),
        ),
        migrations.AlterField(
            model_name='address',
            name='state',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='State'),
        ),
        migrations.AlterField(
            model_name='address',
            name='street1',
            field=models.TextField(blank=True, max_length=250, null=True, verbose_name='Street 1'),
        ),
        migrations.AlterField(
            model_name='address',
            name='street2',
            field=models.TextField(blank=True, max_length=250, null=True, verbose_name='Street 2'),
        ),
        migrations.AlterField(
            model_name='address',
            name='zipcode',
            field=models.CharField(blank=True, max_length=8, null=True, verbose_name='Zipcode'),
        ),
    ]