# -*- coding:UTF-8 -*-
# 创建一个新房间，并为房主创建玩家信息

from app_db.models import RoomInfo
from app_db.models import UserInfo
from django.core.exceptions import ObjectDoesNotExist
import app_websocket_method.glob
from app_websocket_method import glob

def create(u_id,r_name):
    RoomInfo.objects.all().delete()
    # 获取一个未使用的房间号
    mark = False
    room_id = 0
    for i in range(len(glob.room_id)):
        if glob.room_id[i] == 0:
            glob.room_id[i] = 1
            room_id = i
            mark = True
            break
    if mark == False:
        room_id = len(glob.room_id)
        glob.room_id.append(1)



    # 操作数据库

    user = UserInfo.objects.get(id = int(u_id))

    newRoom = RoomInfo(room_id=str(room_id),room_name=r_name,owner_id=u_id,player_num=1,
                       player_id=u_id,player_nick=user.nick_name,player_alive="true",
                       player_seat=str(0),state = 1)
    newRoom.save()

    #newPlayer = PlayerInfo(name=user_name,room_id=room_id,alive=True)
    #newPlayer.save()


    # glob添加新对象
    glob.room_request_id[str(room_id)] = 0
    glob.room_player_num[str(room_id)] = 1
    glob.room_alive_num[str(room_id)] = 1
    glob.room_mark[str(room_id)] = {u_id:0}
    glob.room_open[str(room_id)] = True
    glob.room_owner_id[str(room_id)] = u_id
    glob.user_nick[u_id] = user.nick_name
    glob.user_request_id[u_id]=0


    return room_id