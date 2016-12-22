# -*- coding:UTF-8 -*-
#游戏开始时为房间内玩家分配角色

from app_db.models import RoomInfo
import glob
import random
import demjson
import send_message
import room_state_change

def assign(data):

    r_id = data['room_id']
    wolf_num = data['wolf_num']
    seer_num = data['seer_num']
    hunter_num = data['hunter_num']
    village_num = data['village_num']
    witch_num = data['witch_num']
    cupid_num = data['cupid_num']
    guard_num = data['guard_num']
    rule = data['rule']

    glob.room_role_number[r_id]['wolf'] = int(wolf_num)
    glob.room_role_number[r_id]['seer'] = int(seer_num)
    glob.room_role_number[r_id]['hunter'] = int(hunter_num)
    glob.room_role_number[r_id]['witch'] = int(witch_num)
    glob.room_role_number[r_id]['cupid'] = int(cupid_num)
    glob.room_role_number[r_id]['guard'] = int(guard_num)


    room = RoomInfo.objects.get(room_id = r_id)
    room.rule = int(rule)

    id_list = glob.room_mark[r_id].keys()
    id_role = {}    #id -> role
    num = glob.room_player_num[r_id]    #房间人数
    #先默认是village
    for i in range(len(id_list)):
        id_role[id_list[i]] = 'village'

    # 分配角色
    i = 0
    n = 0
    while (i < int(wolf_num)):
        n = random.randint(0,num-1)
        if(id_role[id_list[n]] == 'village'):
            id_role[id_list[n]] = 'wolf'
            i = i + 1
    i = 0
    while (i < int(seer_num)):
        n = random.randint(0,num-1)
        if(id_role[id_list[n]] == 'village'):
            id_role[id_list[n]] = 'seer'
            i = i + 1
    i = 0
    while (i < int(hunter_num)):
        n = random.randint(0,num-1)
        if(id_role[id_list[n]] == 'village'):
            id_role[id_list[n]] = 'hunter'
            i = i + 1
    i = 0
    while (i < int(witch_num)):
        n = random.randint(0,num-1)
        if(id_role[id_list[n]] == 'village'):
            id_role[id_list[n]] = 'witch'
            i = i + 1
    i = 0
    while (i < int(cupid_num)):
        n = random.randint(0,num-1)
        if(id_role[id_list[n]] == 'village'):
            id_role[id_list[n]] = 'cupid'
            i = i + 1
    i = 0
    while (i < int(guard_num)):
        n = random.randint(0,num-1)
        if(id_role[id_list[n]] == 'village'):
            id_role[id_list[n]] = 'guard'
            i = i + 1

    # 填写房间和用户信息
    glob.room_aliver_wolf_num[r_id] = int(wolf_num)

    key = id_role.keys()
    for id in key:
        glob.user_role[id] = id_role[id]

    id_list = room.player_id.split(',')
    rolestr = ""
    for i in range(len(id_list)):
        if i == len(id_list):
            rolestr = rolestr + id_role[id_list[i]]
        else:
            rolestr = rolestr + id_role[id_list[i]] + ","
    room.player_role = rolestr
    room.save()

    #发送信息
    message = {'type': '4', 'room_request_id': str(glob.room_request_id[r_id]), 'list': id_role}
    json = demjson.encode(message)
    send_message.send(r_id, json)
    #glob.room_request_content[r_id].append(json)

    #room_state_change.change(0,r_id)


    return