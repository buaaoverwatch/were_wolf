# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-01-03 08:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_db', '0007_auto_20161223_1038'),
    ]

    operations = [
        migrations.AddField(
            model_name='userinfo',
            name='friends',
            field=models.CharField(default='', max_length=200),
        ),
    ]
