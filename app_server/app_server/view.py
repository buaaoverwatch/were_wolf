# -*- coding:UTF-8 -*-
import json
import demjson
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from app_db.models import UserInfo

from app_http_method import Register, Login, create_room, join_room, get_record, updata_user_info, get_room_info, get_room_list



@csrf_exempt
def register(request):
	if request.method == 'POST':
		data = request.POST
		print data
		key = data.keys()
		data = json.loads(key[0])

		user_name = data['user_name']
		nick_name = data['nick_name']
		password = data['password']
		intro = data['introduce']

		_type = Register.addUser(user_name, nick_name, password, intro)
		if _type == -1:
			data = [{'type': '-1','id':'-1'}]
		else:
			data = [{'type' : '0','id':str(_type)}]
		js = demjson.encode(data)
		return HttpResponse(js)
	else:
		data = [{'type': '2','id':'-1'}]
		js = demjson.encode(data)
		return HttpResponse(js)

@csrf_exempt
def login(request):
	if request.method == 'POST':
		data = request.POST
		key = data.keys()
		data = json.loads(key[0])

		name = data['user_name']
		password = data['password']

		_id = Login.checkUser(name, password)
		user =UserInfo.objects.get(user_name = name)

		if _id == -1:
			data = [{'type':'1','id':'-1','nick':'null','intro':'null'}]
		elif _id == -2:
			data = [{'type': '2', 'id': '-1','nick':'null','intro':'null'}]
		else :
			data = [{'type': '0', 'id': str(_id),'nick':user.nick_name,'intro':user.introduce}]

		js = demjson.encode(data)
		return HttpResponse(js)
	else:
		return HttpResponse('not POST message')

@csrf_exempt
def createRoom(request):
	data = request.POST
	key = data.keys()
	data = json.loads(key[0])

	user_id = data['user_id']
	room_name = data['room_name']

	result = create_room.create(user_id, room_name)

	if result == -1:
		data={'result':'1','number':str(result)}
	else:
		data={'result': '0', 'number': str(result)}
	js = demjson.encode(data)
	return HttpResponse(js)

@csrf_exempt
def joinRoom(request):
	data = request.POST
	key = data.keys()
	data = json.loads(key[0])

	room_id = data['room_id']
	user_id = data['user_id']

	data = join_room.join(user_id, room_id)
	js = demjson.encode(data)
	return HttpResponse(js)

#查询战绩
@csrf_exempt
def getRecord(request):
	data = request.POST
	key = data.keys()
	data = json.loads(key[0])

	user_id = data['user_id']
	message = get_record.get(user_id)
	js = demjson.encode(message)
	return HttpResponse(js)

#更新用户信息
@csrf_exempt
def updataInfo(request):
	data = request.POST
	key = data.keys()
	data = json.loads(key[0])

	user_id = data['user_id']
	nick = data['nick_name']
	password = data['password']
	intro = data['intro']

	result = updata_user_info.updata(user_id, nick, password, intro)
	data = {'result': str(result)}
	js = demjson.encode(data)
	print js
	return HttpResponse(js)

#获取房间列表
@csrf_exempt
def getRoomList(request):

	message = get_room_list.get()
	js = demjson.encode(message)
	return HttpResponse(js)

#获取指定房间房间
@csrf_exempt
def getRoomInfo(request):
	data = request.POST
	key = data.keys()
	data = json.loads(key[0])

	room_id = data['room_id']
	message = get_room_info.get(room_id)
	js = demjson.encode(message)
	return HttpResponse(js)


















