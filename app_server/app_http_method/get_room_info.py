# -*- coding:UTF-8 -*-

from app_db.models import RoomInfo
from app_db.models import UserInfo
from django.core.exceptions import ObjectDoesNotExist

def get(r_id):
    try:
        r = RoomInfo.objects.get(room_id=r_id)
        owner = UserInfo.objects.get(id = int(r.owner_id))

        data = {'room_id':r.room_id,
                'room_name':r.room_name,
                'owner_name':owner.nick_name}
    except ObjectDoesNotExist:
        data = {'room_id':'-1'}


    return data