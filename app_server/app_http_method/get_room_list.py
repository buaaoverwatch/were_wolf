# -*- coding:UTF-8 -*-
from app_db.models import RoomInfo
from django.core.exceptions import ObjectDoesNotExist

def get():
    #返回的是一个QuerySet
    message = []
    try:
        rooms = RoomInfo.objects.all().values_list('room_id', 'room_name')
        for r in rooms:
            message.append({'id':r[0],'name':r[1]})
    except ObjectDoesNotExist:
        message.append({'id':'-1','name':"null"})


    return message