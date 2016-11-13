# -*- coding:UTF-8 -*-
from app_db.models import RoomInfo
import glob

#要改变存活玩家和狼人数
def kill(r_id,o_id):
    room = RoomInfo.objects.get(room_id=r_id)
    id_list = room.player_id.split(',')
    alive_list = room.player_alive.split(',')

    index = id_list.index(o_id)
    if(alive_list[index] == "false"):
        return
    alive_list[index] = "false"
    newStr = ""
    for i in range(len(alive_list)):
        if i == len(alive_list):
            newStr = newStr + alive_list[i]
        else:
            newStr = newStr + alive_list[i] + ","

    room.player_alive = newStr
    room.save()

    glob.room_alive_num[r_id] = glob.room_alive_num[r_id] - 1
    glob.user_alive[o_id] = 'false'

    role = glob.user_role[o_id]
    if role == "wolf":
        glob.room_aliver_wolf_num[r_id] = glob.room_aliver_wolf_num[r_id] - 1


    #情侣
    couples = glob.room_couples_id[r_id]
    if o_id in couples:
        index = id_list.index(couples[0])
        if (alive_list[index] == "true"):
            kill(r_id,couples[0])
        else:
            index = id_list.index(couples[1])
            if (alive_list[index] == "true"):
                kill(r_id, couples[1])


    return

def save(r_id,o_id):
    room = RoomInfo.objects.get(room_id=r_id)
    id_list = room.player_id.split(',')
    alive_list = room.player_alive.split(',')

    # 这里id_list中是字符串,o_id是数字
    index = id_list.index(str(o_id))
    if (alive_list[index] == "true"):
        return
    alive_list[index] = "true"
    newStr = ""
    for i in range(len(alive_list)):
        if i == len(alive_list):
            newStr = newStr + alive_list[i]
        else:
            newStr = newStr + alive_list[i] + ","

    room.player_alive = newStr
    room.save()

    glob.room_alive_num[r_id] = glob.room_alive_num[r_id] + 1
    role = glob.user_role[o_id]
    if role == "wolf":
        glob.room_aliver_wolf_num[r_id] = glob.room_aliver_wolf_num[r_id] + 1

    return