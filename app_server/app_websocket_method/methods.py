# -*- coding:UTF-8 -*-
import glob
from app_db.models import RoomInfo
import demjson
import send_message
from collections import Counter
import room_state_change
import player_state_change

def lock_room(r_id,u_id):
    if int(r_id) >= len(glob.room_id) or glob.room_id[int(r_id)] == 0:
        return False
    elif glob.room_owner_id[r_id] != u_id:
        return False
    else:
        glob.room_open[r_id] = False
        return True

def select_seat(r_id,u_id,seat):
    result = 'false'
    used_seat = glob.room_player_seat[r_id].values()
    if int(seat) < 1 or int(seat) > glob.room_player_num[r_id]:
        result = 'false'
    elif seat in used_seat:
        if u_id in glob.room_player_seat[r_id].keys():
            if glob.room_player_seat[r_id][u_id] == seat:
                result = 'true'
            else:
                result = 'false'
        else:
            result = 'false'
    else:
        glob.room_player_seat[r_id][u_id] = seat           #这代表着一个人可以选多次座位
        result = 'true'
    print result
    message = {'type':'3','room_request_id':str(glob.room_request_id[r_id]),'user_id':u_id,'seat':seat,'result':result}
    json = demjson.encode(message)
    send_message.send(r_id,json)

    #存数据库
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

def next_step(r_id,u_id):
    list = glob.room_next[r_id]
    if u_id not in list:
        list.append(u_id)

    room = RoomInfo.objects.get(room_id=r_id)
    state = room.state
    need_num = glob.room_alive_num[r_id]
    if state == 0 or state == 1 or state == 2 or state == 4 or state == 6 or state == 8 or state == 9 or state == 11 or state == 13 or state == 15 or state == 16:
        need_num = 1
    elif state == 5:
        need_num = 2
    elif state == 7:
        need_num = glob.room_aliver_wolf_num[r_id]
    # elif state == 11:
    #     need_num = len(glob.room_sheriff_list[r_id])
    #警长和遗言
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
        send_message.send(r_id, json)
        #glob.room_request_content[r_id].append(json)
        glob.room_sheriff_list[r_id] = []
        room_state_change.change(0, r_id)
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
            json = demjson.encode(message)
            send_message.send(r_id, json)
        else:
            result = Counter(v).most_common(1)[0][0]
            glob.room_sheriff_id[r_id] = result
            room = RoomInfo.objects.get(room_id=r_id)
            room.sheriff_id = o_id
            room.save()
            message = {'type': '9', 'room_request_id': str(glob.room_request_id[r_id]),
                'result':'true','sheriff_id':str(result),'list': list}
            json = demjson.encode(message)
            send_message.send(r_id, json)
            room_state_change.change(0, r_id)

        #glob.room_request_content[r_id].append(json)
        glob.room_select_num[r_id] = 0
        glob.room_sheriff_list[r_id] = []
        glob.room_sheriff_select[r_id] = {}

    return

#白天投票
def day_vote(r_id,u_id,o_id):
    glob.room_sheriff_select[r_id][u_id] = o_id
    glob.room_select_num[r_id] = glob.room_select_num[r_id] + 1

    if(glob.room_sheriff_id[r_id] == u_id):
        glob.room_sheriff_select[r_id][-1] = o_id
        glob.room_select_num[r_id] = glob.room_select_num[r_id] + 1

    if  (glob.room_sheriff_id[r_id]!='-1' and glob.room_select_num[r_id] == glob.room_alive_num[r_id] + 1) \
            or (glob.room_sheriff_id[r_id]=='-1' and glob.room_select_num[r_id] == glob.room_alive_num[r_id]):

        list = glob.room_sheriff_select[r_id]
        v = list.values()
        temp = Counter(v).most_common(2)
        #平票
        if(temp[0][1] == temp[1][1]):
            message = {'type': '17', 'room_request_id': str(glob.room_request_id[r_id]),
                        'result': 'false', 'sheriff_id': '-1', 'list': list}
            json = demjson.encode(message)
            send_message.send(r_id, json)
        else:
            result = Counter(v).most_common(1)[0][0]
            player_state_change.kill(r_id,o_id)
            message = {'type': '17', 'room_request_id': str(glob.room_request_id[r_id]),
                'result':'true','sheriff_id':str(result),'list': list}
            json = demjson.encode(message)
            send_message.send(r_id, json)
            room_state_change.change(0, r_id)

        #glob.room_request_content[r_id].append(json)
        glob.room_select_num[r_id] = 0
        glob.room_sheriff_list[r_id] = []
        glob.room_sheriff_select[r_id] = {}


    return


def leave(r_id,u_id):
    #玩家死亡
    player_state_change.kill(r_id, u_id)
    #删除glob里面的记录，数据库中的可以先留着
    glob.room_player_num[r_id] = glob.room_player_num[r_id] - 1
    if u_id in glob.room_mark[r_id].keys():
        del glob.room_mark[r_id][u_id]
    if u_id in glob.user_request_id.keys():
        del glob.user_request_id[u_id]
    if u_id in glob.user_nick.keys():
        del glob.user_nick[r_id]
    if u_id in glob.user_role.keys():
        del glob.user_role[r_id]
    if u_id in glob.user_alive.keys():
        del glob.user_alive[r_id]

    message = {'type': '13', 'room_request_id': str(glob.room_request_id[r_id]),
               'user_id': u_id}
    json = demjson.encode(message)
    #send_message.send(r_id, json)
    glob.room_request_content[r_id].append(json)
    return



def connet_couples(r_id,u_id,o1_id,o2_id):
    glob.room_couples_id[r_id].append(o1_id)
    glob.room_couples_id[r_id].append(o2_id)
    message = {'type': '16', 'room_request_id': str(glob.room_request_id[r_id]),
               'user1_id': o1_id,'user2_id':o2_id}
    json = demjson.encode(message)
    send_message.send(r_id, json)
    return

def test(r_id,u_id,seat):
    message = {'type': '3', 'room_request_id': str(100), 'user_id': u_id, 'seat': seat,
               'result': 'true'}
    json = demjson.encode(message)
    send_message.send(r_id, json)
    return