# -*- coding:UTF-8 -*-
from __future__ import unicode_literals

from django.db import models

#id 全用字符串

# Create your models here.
# 登录用
class UserInfo(models.Model):
	#id = models.IntegerField()
	user_name = models.CharField(max_length=50,default='user')
	nick_name = models.CharField(max_length=30,default='nick')
	password = models.CharField(max_length=30,default='123456')
	introduce = models.CharField(max_length=200,default='无可奉告')

class RoomInfo(models.Model):
	room_id = models.CharField(max_length=10,default=-1)
	room_name = models.CharField(max_length=30,default='room')
	owner_id  = models.CharField(max_length=10,default=-1)
	rule = models.IntegerField(default=1)	#游戏规则，0杀光所有人，1杀光有技能的人
	player_num = models.IntegerField(default=0)			#玩家人数
	player_id = models.CharField(max_length=100,default=str(-1)) #所有玩家的id合成的字符串，以逗号分隔
	player_nick = models.CharField(max_length=300,default='nick')
	player_role = models.CharField(max_length=200,default='village')
	player_alive = models.CharField(max_length=100,default='true') #true or false
	player_seat = models.CharField(max_length=100,default=str(0))
	sheriff_id = models.CharField(max_length=10,default=-1) #警长id
	round = models.IntegerField(default=1) 	#轮数
	state = models.IntegerField(default=1)	#状态

# 记录玩家的游戏相关信息
#class PlayerInfo(models.Model):
	# name = models.CharField(max_length=30)
	# room_id = models.IntegerField()
	# role = models.IntegerField()
	# alive = models.BooleanField()

#战绩表
class standings(models.Model):
	user_id = models.CharField(max_length=10,default=-1)
	role = models.CharField(max_length=10,default='village')
	result = models.CharField(max_length=10,default='true')
	id_list = models.CharField(max_length=100,default=str(-1)) #所有玩家id