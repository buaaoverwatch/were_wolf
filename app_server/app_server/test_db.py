# -*- coding:UTF-8 -*-
from app_db.models import UserInfo
from app_db.models import RoomInfo
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from channels import Group

@csrf_exempt
def test(request):
    # user = UserInfo(user_name = 'hh2',nick_name='bb',password='ads',introduce='测试')
    # user.save()
    # user = UserInfo(user_name='hh', nick_name='bb', password='ads', introduce='测试')
    # user.save()
    # users = UserInfo.objects.get(user_name = 'hh')
    # print users

    # r1 = RoomInfo(room_id = 1,room_name = 'rom1')
    # r1.save()
    # r2 = RoomInfo(room_id=2, room_name='rom2')
    # r2.save()
    # r3 = RoomInfo(room_id=3, room_name='rom2')
    # r3.save()
    # rooms = RoomInfo.objects.filter(room_name = 'rom2')
    # for i in rooms:
    #     print i.room_id
    # print rooms

    # message = "websocket success"
    # room_id = '0'
    # Group("room-%s" % room_id).send({
    #     "text": message,
    # })

    return HttpResponse('success')