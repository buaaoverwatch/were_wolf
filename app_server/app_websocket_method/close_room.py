# -*- coding:UTF-8 -*-
from app_db.models import RoomInfo
from app_db.models import standings
import glob

def close(r_id,result):
    room = RoomInfo.objects.get(room_id=r_id)
    id_list = room.player_id.split(',')
    role_list = room.player_role.split(',')

    #修改glob
    if int(r_id) < len(glob.room_id):
        glob.room_id[int(r_id)] = 0
    if r_id in glob.room_request_id:
        del glob.room_request_id[r_id]
    if r_id in glob.room_open:
        del glob.room_open[r_id]
    if r_id in glob.room_player_num:
        del glob.room_player_num[r_id]
    if r_id in glob.room_mark:
        del glob.room_mark[r_id]
    if r_id in glob.room_owner_id:
        del glob.room_owner_id[r_id]
    if r_id in glob.room_player_seat:
        del glob.room_player_seat[r_id]
    if r_id in glob.room_role_number:
        del glob.room_role_number[r_id]
    if r_id in glob.room_next:
        del glob.room_next[r_id]
    if r_id in glob.room_wolf_select:
        del glob.room_wolf_select[r_id]
    if r_id in glob.room_select_num:
        del glob.room_select_num[r_id]
    if r_id in glob.room_sheriff_list:
        del glob.room_sheriff_list[r_id]
    if r_id in glob.room_sheriff_select:
        del glob.room_sheriff_select[r_id]
    if r_id in glob.room_alive_num:
        del glob.room_alive_num[r_id]
    if r_id in glob.room_aliver_wolf_num:
        del glob.room_aliver_wolf_num[r_id]
    if r_id in glob.room_request_content:
        del glob.room_request_content[r_id]
    if r_id in glob.room_couples_id:
        del glob.room_couples_id[r_id]


    for id in id_list:
        if id in glob.user_request_id.keys():
            if id in glob.user_request_id:
                del glob.user_request_id[id]
            if id in glob.user_nick:
                del glob.user_nick[id]
            if id in glob.user_role:
                del glob.user_role[id]
            if id in glob.user_alive:
                del glob.user_alive[id]



    #修改数据库
    room.delete()

    if result == -1:
        return

    for i in range(len(id_list)):
        if result == 0 and role_list[i] == 'wolf':
            record = standings(user_id = id_list[i],role = role_list[i],result = 'true',id_list = room.player_id)
        elif result == 1 and role_list[i] != 'wolf':
            record = standings(user_id = id_list[i],role = role_list[i],result = 'true',id_list = room.player_id)
        elif result == 2 and (role_list[i] == 'cupid' or role_list[i] in glob.room_couples_id[r_id]):
            record = standings(user_id = id_list[i],role = role_list[i],result = 'true',id_list = room.player_id)
        else:
            record = standings(user_id = id_list[i],role = role_list[i],result = 'false',id_list = room.player_id)
        record.save()

    return