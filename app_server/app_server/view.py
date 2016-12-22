# -*- coding:UTF-8 -*-
import json
import demjson
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from app_db.models import UserInfo
from app_websocket_method import send_message
from app_http_method import Register, Login,Logout, create_room, join_room, get_record, updata_user_info, get_room_info, get_room_list
from app_db.models import UserInfo
from django.core.exceptions import ObjectDoesNotExist


@csrf_exempt
def register(request):
	if request.method == 'POST':
		data = request.POST
		print data
		key = data.keys()
		data = json.loads(key[0])
		# data = request.POST['data']
		# data = demjson.decode(data)
		user_name = data['user_name']
		nick_name = data['nick_name']
		password = data['password']
		intro = data['introduce']
		question = data['question']
		answer = data['answer']

		_type = Register.addUser(user_name, nick_name, password, intro,question ,answer)
		if _type == -1:
			data = [{'type': '1','id':'-1'}]
		else:
			data = [{'type' : '0','id':str(_type)}]
		js = demjson.encode(data)
		return HttpResponse(js)
	else:
		data = [{'type': '2','id':'-1'}]
		js = demjson.encode(data)
		return HttpResponse(js)

@csrf_exempt
def findPassword(request):
	if request.method == 'POST':
		data = request.POST
		key = data.keys()
		data = json.loads(key[0])

		user_name = data['user_name']
		question = data['question']
		answer = data['answer']
		new_password = data['new_password']

		try:
			user = UserInfo.objects.get(user_name=user_name)
			if user.question == question and user.answer == answer:
				result = 0
				user.password = new_password
				user.save()
			else:
				result = 2
		except ObjectDoesNotExist:
			result = 1

		js = demjson.encode({'result':result})
		return HttpResponse(js)
	else:
		data = [{'type': '2', 'id': '-1'}]
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

		if _id == -1:
			data = [{'type':'1','id':'-1','nick':'null','intro':'null'}]
		elif _id == -2:
			data = [{'type': '2', 'id': '-2','nick':'null','intro':'null'}]
		elif _id == -3:
			data = [{'type': '3', 'id': '-3', 'nick': 'null', 'intro': 'null'}]
		else :
			user = UserInfo.objects.get(user_name=name)
			data = [{'type': '0', 'id': str(_id),'nick':user.nick_name,'intro':user.introduce}]
		print 3
		js = demjson.encode(data)
		print 4
		return HttpResponse(js)
	else:
		return HttpResponse('not POST message')


@csrf_exempt
def logout(request):
	if request.method == 'POST':
		data = request.POST
		key = data.keys()
		data = json.loads(key[0])

		name = data['user_name']
		id = data['user_id']
		result = Logout.logout(id,name)

		data = [{'result': str(result)}]
		js = demjson.encode(data)
		print 4
		return HttpResponse(js)
	else:
		return HttpResponse('not POST message')


@csrf_exempt
def createRoom(request):
	data = request.POST
	key = data.keys()
	data = json.loads(key[0])
	print data

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
	question = data['question']
	answer = data['answer']

	result = updata_user_info.updata(user_id, nick, password, intro,question,answer)
	data = {'result': str(result)}
	js = demjson.encode(data)
	print js
	return HttpResponse(js)

#获取房间列表
@csrf_exempt
def getRoomList(request):

	message = get_room_list.get()
	js = demjson.encode(message)
	print js
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


















