# -*- coding:UTF-8 -*-
from app_db.models import UserInfo
from app_websocket_method import glob
from django.core.exceptions import ObjectDoesNotExist
import Logout

#成功返回id
#用户不存在 -1
#密码不对 -2
#已登录 -3

def checkUser(_name,_password):
	try:
		user = UserInfo.objects.get(user_name = _name)
	except ObjectDoesNotExist:
		return -1

	#已登录
	if _name in glob.user_name:
		#在房间
		if user.id in glob.user_alive.keys():
			return -3
		#不在房间
		else:
			Logout.logout(user.id,_name)
			glob.user_name.append(_name)
			glob.user_nick[str(user.id)] = user.nick_name
			glob.user_request_id[str(user.id)] = 0
			glob.user_alive[str(user.id)] = 'true'
			glob.user_role[str(user.id)] = 'village'
			return user.id

	if user.password == _password:
		glob.user_name.append(_name)
		glob.user_nick[str(user.id)] = user.nick_name
		glob.user_request_id[str(user.id)] = 0
		glob.user_alive[str(user.id)] = 'true'
		glob.user_role[str(user.id)] = 'village'
		return user.id
	else:
		return -2