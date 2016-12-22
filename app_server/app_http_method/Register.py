# -*- coding:UTF-8 -*-
from app_db.models import UserInfo
from django.core.exceptions import ObjectDoesNotExist

def addUser(u_name,n_name,_password,intro,question ,answer):
	try:
		user = UserInfo.objects.get(user_name = u_name)
	except ObjectDoesNotExist:
		user1 = UserInfo(user_name=u_name,nick_name=n_name,password=_password,introduce=intro,question=question ,answer=answer)
		user1.save()
		id = user1.id
		return id
	return -1