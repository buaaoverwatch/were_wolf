# -*- coding:UTF-8 -*-
from app_db.models import UserInfo
from django.core.exceptions import ObjectDoesNotExist

#成功返回id
#用户不存在 -1
#密码不对 -2

def checkUser(_name,_password):
	try:
		user = UserInfo.objects.get(user_name = _name)
	except ObjectDoesNotExist:
		return -1
	if user.password == _password:
		return user.id
	else:
		return -2