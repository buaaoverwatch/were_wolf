# -*- coding:UTF-8 -*-
# 加入房间并创建新玩家

from app_db.models import RoomInfo
from app_db.models import UserInfo
from django.core.exceptions import ObjectDoesNotExist
import app_websocket_method.glob
from app_websocket_method import glob
from app_websocket_method import send_message
import demjson


#如何确定房间已满？？？？？？？？？？

def join(u_id,r_id):

    if glob.room_id[r_id] == 0:
        return 1
    elif glob.room_open[r_id] == False:
        return 2


    # 操作数据库
    user = UserInfo.objects.get(id = int(u_id))
    # 修改房间信息
    r = RoomInfo.objects.get(room_id=r_id)
    r.player_num = r.player_num+1
    r.player_id = r.player_id + ',' + u_id
    r.player_nick = r.player_nick + ',' + user.nick_name
    r.player_role = r.player_role + ',' + "village"
    r.player_alive = r.player_alive + ',' + 'true'
    r.player_seat = r.player_seat + ',' + str(0)
    r.save()

    # 添加玩家信息
    #newPlayer = PlayerInfo(name=user_name, room_id=room_id, alive=True)
    #newPlayer.save()

    # 更改glob
    glob.room_mark[r_id][u_id] = 0
    glob.user_request_id[u_id] = 0
    glob.user_nick[u_id] = user.nick_name
    glob.user_alive[u_id] = 'true'
    glob.room_player_num[r_id] = glob.room_player_num[r_id] + 1
    glob.room_alive_num[r_id] = glob.room_alive_num[r_id] + 1


    id_list = glob.room_mark[r_id].keys()
    id_nick = {}
    for i in id_list:
        id_nick[i] = glob.user_nick[i]

    message = {'type':'2','room_request_id':str(glob.room_request_id[r_id]),'id_nick':id_nick}
    json = demjson.encode(message)
    send_message.send(r_id,json)

    return 0