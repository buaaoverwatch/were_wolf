# -*- coding:UTF-8 -*-
from app_db.models import UserInfo
from django.core.exceptions import ObjectDoesNotExist

def addUser(u_name,n_name,_password,intro):
	try:
		user = UserInfo.objects.get(user_name = u_name)
	except ObjectDoesNotExist:
		user1 = UserInfo(user_name=u_name,nick_name=n_name,password=_password,introduce=intro)
		id = user1.id
		user1.save()
		return id
	return -1