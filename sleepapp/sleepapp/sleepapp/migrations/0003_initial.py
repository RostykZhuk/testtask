# Generated by Django 5.0.1 on 2024-01-09 14:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('sleepapp', '0002_auto_20240108_1422'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SleepLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('feeling', models.IntegerField(choices=[(1, 'Bad'), (2, 'Ok'), (3, 'Good')])),
                ('bed_time_start', models.DateTimeField()),
                ('bed_time_end', models.DateTimeField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
