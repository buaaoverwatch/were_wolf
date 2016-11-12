# -*- coding:UTF-8 -*-
import glob
from app_db.models import RoomInfo
import demjson
import send_message
import room_state_change
from collections import Counter
import room_state_change
import player_state_change

def lock_room(r_id,u_id):
    if glob.room_id[r_id] == 0:
        return False
    elif glob.room_owner_id[r_id] != u_id:
        return False
    else:
        glob.room_open[r_id] = False



        room_state_change.change(0,r_id)
        return True

def select_seat(r_id,u_id,seat):
    result = 'false'
    used_seat = glob.room_player_seat[r_id].values()
    if int(seat) < 1 or int(seat) > glob.room_player_num[r_id]:
        result = 'false'
    elif seat in used_seat:
        result = 'false'
    else:
        glob.room_player_seat[r_id][u_id] = seat           #这代表着一个人可以选多次座位
        result = 'true'

    message = {'type':'3','room_request_id':str(glob.room_request_id[r_id]),'user_id':u_id,'seat':seat,'result':result}
    json = demjson.encode(message)
    send_message.send(r_id,json)


    if len(glob.room_player_seat[r_id]) == glob.room_player_num[r_id]:  #全都选好位置
        room = RoomInfo.objects.get(room_id = r_id)
        newstr = ""
        id_list = room.player_id.split(',')
        for i in range(len(id_list)):
            if i == len(id_list):
                newstr = newstr + str(glob.room_player_seat[r_id][id_list[i]])
            else:
                newstr = newstr + str(glob.room_player_seat[r_id][id_list[i]]) + ","
        room.player_seat = newstr
        room.save()


    return

def next_step(r_id,u_id,need_num):
    list = glob.room_next[r_id]
    if u_id not in list:
        list.append(u_id)

    if len(list) == int(need_num):
        room_state_change.change(0,r_id)
        list = []
        glob.room_next[r_id] = list

    return

def join_compaign_sheriff(r_id,u_id,sheriff):
    if sheriff == 'true':
        glob.room_sheriff_list[r_id].append(u_id)
    glob.room_select_num[r_id] = glob.room_select_num[r_id] +1

    if glob.room_select_num[r_id] == glob.room_alive_num[r_id]:
        glob.room_select_num[r_id] = 0
        message = {'type': '8', 'room_request_id': str(glob.room_request_id[r_id]), 'list': glob.room_sheriff_list[r_id]}
        json = demjson.encode(message)
        #send_message.send(r_id, json)
        glob.room_request_content[r_id].append(json)
        glob.room_sheriff_list[r_id] = []
    return

def sheriff_vote(r_id,u_id,o_id):
    glob.room_sheriff_select[r_id][u_id] = o_id
    glob.room_select_num[r_id] = glob.room_select_num[r_id] + 1

    if glob.room_select_num[r_id] == glob.room_alive_num[r_id]:

        list = glob.room_sheriff_select[r_id]
        v = list.values()
        temp = Counter(v).most_common(2)
        #平票
        if(temp[0][1] == temp[1][1]):
            message = {'type': '9', 'room_request_id': str(glob.room_request_id[r_id]),
                       'result': 'false', 'sheriff_id': '-1', 'list': list}
        else:
            result = Counter(v).most_common(1)[0][0]
            message = {'type': '9', 'room_request_id': str(glob.room_request_id[r_id]),
                   'result':'true','sheriff_id':str(result),'list': list}
        json = demjson.encode(message)
        #send_message.send(r_id, json)
        glob.room_request_content[r_id].append(json)

        glob.room_select_num[r_id] = 0
        glob.room_sheriff_list[r_id] = []
        glob.room_sheriff_select[r_id] = {}


    return

# def connect_again(r_id,u_id):
#     result = True
#     if glob.room_id[r_id] == 0:
#         result = False
#
#     list = glob.room_mark[r_id].keys()
#     if u_id not in list:
#
#
#
#     return

def leave(r_id,u_id):
    #玩家死亡
    player_state_change.kill(r_id, u_id)
    #删除glob里面的记录，数据库中的可以先留着
    glob.room_player_num[r_id] = glob.room_player_num[r_id] - 1
    del glob.room_mark[r_id][u_id]
    del glob.user_request_id[u_id]
    del glob.user_nick[r_id]
    del glob.user_role[r_id]
    del glob.user_alive[r_id]

    message = {'type': '13', 'room_request_id': str(glob.room_request_id[r_id]),
               'user_id': u_id}
    json = demjson.encode(message)
    #send_message.send(r_id, json)
    glob.room_request_content[r_id].append(json)
    return



def test(r_id,u_id,seat):
    message = {'type': '3', 'room_request_id': str(100), 'user_id': u_id, 'seat': seat,
               'result': 'true'}
    json = demjson.encode(message)
    send_message.send(r_id, json)
    return