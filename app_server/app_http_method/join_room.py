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

    mark = False  #重复进入同一个房间

    data = {'result':'0','room_name':'null','owner_id':'0','id_nick':{}}
    
    if glob.user_room_id[u_id] != -1:
        if glob.user_room_id[u_id] != int(r_id):
            data['result'] = '3'
            return data
        else:
            mark = True

    if int(r_id) < len(glob.room_id):
        if glob.room_id[int(r_id)] == 0:
            data['result'] = '1'
            return data
        elif glob.room_open[r_id] == False:
            data['result'] = '2'
            return data
    else:
        data['result'] = '1'
        return data


    # 操作数据库
    user = UserInfo.objects.get(id = int(u_id))
    # 修改房间信息
    r = RoomInfo.objects.get(room_id=r_id)

    data['room_name'] = r.room_name
    data['owner_id'] = r.owner_id

    if mark == False:
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
        glob.room_mark[r_id][u_id] = 1
        glob.user_request_id[u_id] = 0
        glob.user_nick[u_id] = user.nick_name
        glob.user_alive[u_id] = 'true'
        glob.user_role[u_id] = 'village'
        glob.user_room_id[u_id] = int(r_id)
        glob.room_player_num[r_id] = glob.room_player_num[r_id] + 1
        glob.room_alive_num[r_id] = glob.room_alive_num[r_id] + 1


        id_list = glob.room_mark[r_id].keys()
        id_nick = {}
        for i in id_list:
            id_nick[i] = glob.user_nick[i]

        message = {'type':'2','room_request_id':str(glob.room_request_id[r_id]),'id_nick':id_nick}
        print message
        json = demjson.encode(message)
        send_message.send(r_id,json)


    id_list = glob.room_mark[r_id].keys()
    print id_list
    print glob.user_nick.keys()
    id_nick = {}
    for i in id_list:
        id_nick[i] = glob.user_nick[i]
    data['id_nick'] = id_nick
    return data