# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-10 09:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_db', '0003_auto_20161110_1748'),
    ]

    operations = [
        migrations.AlterField(
            model_name='standings',
            name='user_id',
            field=models.CharField(default=-1, max_length=10),
        ),
    ]
