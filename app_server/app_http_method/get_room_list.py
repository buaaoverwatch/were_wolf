# -*- coding:UTF-8 -*-
from app_db.models import RoomInfo
from django.core.exceptions import ObjectDoesNotExist
from app_websocket_method import glob

def get():
    #返回的是一个QuerySet
    message = []
    try:
        rooms = RoomInfo.objects.all().values_list('room_id', 'room_name','owner_id','player_num','state')
        for r in rooms:
            if r[2] in glob.user_nick:
                owner_name = glob.user_nick[r[2]]
                message.append({'id':r[0],'name':r[1],'owner_name':owner_name,'player_num':str(r[3]),'state':str(r[4])})
    except ObjectDoesNotExist:
        message.append({'id':'-1','name':"null",'player_num':'0','state':'0'})


    return message