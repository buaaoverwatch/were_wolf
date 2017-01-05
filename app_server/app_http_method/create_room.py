# -*- coding:UTF-8 -*-
# 创建一个新房间，并为房主创建玩家信息

from app_db.models import RoomInfo
from app_db.models import UserInfo
from django.core.exceptions import ObjectDoesNotExist
import app_websocket_method.glob
from app_websocket_method import glob
from app_websocket_method import close_room

def create(u_id,r_name):
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
    #删除之前重复的房间
    close_room.close(str(room_id),-1)
    glob.room_id[room_id] = 1

    newRoom = RoomInfo(room_id=str(room_id),room_name=r_name,owner_id=u_id,player_num=1,
                       player_id=u_id,player_nick=user.nick_name,player_alive="true",
                       player_seat=str(0),state = 1,round = 1)
    newRoom.save()



    # glob添加新对象
    glob.room_request_id[str(room_id)] = 0
    glob.room_player_num[str(room_id)] = 1
    glob.room_alive_num[str(room_id)] = 1
    glob.room_aliver_wolf_num[str(room_id)] = 0
    glob.room_mark[str(room_id)] = {u_id:0}
    glob.room_open[str(room_id)] = True
    glob.room_owner_id[str(room_id)] = u_id
    glob.room_player_seat[str(room_id)] = {str(u_id):1}
    glob.room_protect_id[str(room_id)] = '-1'
    glob.room_role_number[str(room_id)] = {}
    glob.room_next[str(room_id)] = []
    glob.room_sheriff_list[str(room_id)] = []
    glob.room_sheriff_select[str(room_id)] = {}
    glob.room_sheriff_id[str(room_id)]=u_id
    glob.room_wolf_select[str(room_id)] = {}
    glob.room_wolf_select_num[str(room_id)] = 0
    glob.room_day_select[str(room_id)] = {}
    glob.room_day_select_num[str(room_id)] = 0
    glob.room_select_num[str(room_id)] = 0
    glob.room_request_content[str(room_id)] = []
    glob.room_couples_id[str(room_id)] = []
    glob.room_player_die[str(room_id)] = False

    glob.user_alive[u_id] = 'true'
    glob.user_role[u_id] = 'village'
    glob.user_nick[u_id] = user.nick_name
    glob.user_request_id[u_id] = 0
    glob.user_room_id[u_id] = room_id








    return room_id