# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-08 14:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RoomInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_id', models.IntegerField(default=-1)),
                ('room_name', models.CharField(default='room', max_length=30)),
                ('owner_id', models.IntegerField(default=-1)),
                ('rule', models.IntegerField(default=0)),
                ('player_num', models.IntegerField(default=0)),
                ('player_id', models.CharField(default=b'-1', max_length=100)),
                ('player_nick', models.CharField(default='nick', max_length=300)),
                ('player_role', models.CharField(default='village', max_length=200)),
                ('player_alive', models.CharField(default='true', max_length=100)),
                ('player_seat', models.CharField(default=b'0', max_length=100)),
                ('sheriff_id', models.IntegerField(default=-1)),
                ('round', models.IntegerField(default=0)),
                ('state', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='standings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField(default=-1)),
                ('role', models.CharField(default='village', max_length=10)),
                ('result', models.BooleanField(default=False)),
                ('id_list', models.CharField(default=b'-1', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='UserInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(default='user', max_length=50)),
                ('nick_name', models.CharField(default='nick', max_length=30)),
                ('password', models.CharField(default='123456', max_length=30)),
                ('introduce', models.CharField(default='\u65e0\u53ef\u5949\u544a', max_length=200)),
            ],
        ),
    ]
