# -*- coding:UTF-8 -*-
from app_db.models import RoomInfo
from app_db.models import standings
import glob

def close(r_id,result):
    room = RoomInfo.objects.get(room_id=r_id)
    id_list = room.player_id.split(',')
    role_list = room.player_role.split(',')

    #修改glob
    glob.room_id[int(r_id)] = 0
    del glob.room_request_id[r_id]
    del glob.room_open[r_id]
    del glob.room_player_num[r_id]
    del glob.room_mark[r_id]
    del glob.room_owner_id[r_id]
    del glob.room_player_seat[r_id]
    del glob.room_role_number[r_id]
    del glob.room_next[r_id]
    del glob.room_wolf_select[r_id]
    del glob.room_select_num[r_id]
    del glob.room_sheriff_list[r_id]
    del glob.room_sheriff_select[r_id]
    del glob.room_alive_num[r_id]
    del glob.room_aliver_wolf_num[r_id]
    del glob.room_request_content[r_id]
    del glob.room_couples_id[r_id]


    for id in id_list:
        if id in glob.user_request_id.keys():
            del glob.user_request_id[id]
            del glob.user_nick[id]
            del glob.user_role[id]
            del glob.user_alive[id]



    #修改数据库
    room.delete()

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