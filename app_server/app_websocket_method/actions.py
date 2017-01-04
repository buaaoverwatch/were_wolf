# -*- coding:UTF-8 -*-
import demjson
from app_db.models import RoomInfo
import send_message
import glob
import player_state_change
import room_state_change

from collections import Counter

def action(r_id,u_id,o_id,act,con):

    message = {}
    room = RoomInfo.objects.get(room_id = r_id)

    if act == '0':    #杀人
        player_state_change.kill(r_id,o_id)
        role = glob.user_role[u_id]
        message = {'type':'7','room_request_id':str(glob.room_request_id[r_id]),
                   'change':{o_id:"false"},'role':role}
        json = demjson.encode(message)
        send_message.send(r_id,json)
        #glob.room_request_content[r_id].append(json)

    elif act == '1':  #救人
        player_state_change.save(r_id,o_id)
        role = glob.user_role[u_id]
        message = {'type': '7', 'room_request_id': str(glob.room_request_id[r_id]),
                   'change': {o_id: "true"}, 'role': role}
        json = demjson.encode(message)
        send_message.send(r_id, json)
        #glob.room_request_content[r_id].append(json)


    elif act == '2':  #狼人选人
        message = {'type': '6', 'room_request_id': str(glob.room_request_id[r_id]),'action':'0', 'wolf_id': u_id, 'object_id':o_id, 'result':'true'}
        json = demjson.encode(message)
        send_message.send(r_id, json)

    elif act == '3':  #给警徽
        glob.room_sheriff_id[r_id] = o_id
        room.sheriff_id = o_id
        room.save()
        message = {'type': '10', 'room_request_id': str(glob.room_request_id[r_id]), 'list': {u_id:o_id}}
        json = demjson.encode(message)
        send_message.send(r_id, json)
        #glob.room_request_content[r_id].append(json)

    elif act == '4':  #不给警徽
        glob.room_sheriff_id[r_id] = '-1'
        room.sheriff_id = '-1'
        room.save()
        message = {'type': '10', 'room_request_id': str(glob.room_request_id[r_id]), 'list': {u_id: '-1'}}
        json = demjson.encode(message)
        #send_message.send(r_id, json)
        glob.room_request_content[r_id].append(json)

    elif act == '5':  # 自爆
        player_state_change.kill(r_id, u_id)
        #player_state_change.kill(r_id, o_id)
        role = glob.user_role[u_id]
        message = {'type': '7', 'room_request_id': str(glob.room_request_id[r_id]),
                   'change': {u_id:'false'}, 'role': role}
        json = demjson.encode(message)
        send_message.send(r_id, json)
        #glob.room_request_content[r_id].append(json)
        room_state_change.change(1,r_id)

    elif act == '6': #狼人聊天
        message = {'type': '14', 'room_request_id': str(glob.room_request_id[r_id]),
                   'user_id':u_id,'content':con}
        json = demjson.encode(message)
        send_message.send(r_id, json)

    elif act == '7': #狼人杀人
        if r_id not in glob.room_wolf_select:
            glob.room_wolf_select[r_id] = o_id
            glob.room_wolf_select_num[r_id] = 1
        else:
            if glob.room_wolf_select[r_id] != o_id:
                message = {'type': '6', 'room_request_id': str(glob.room_request_id[r_id]), 'action': '1',
                           'wolf_id': u_id,'object_id': o_id,'result':'false'}
            else:
                message = {'type': '6', 'room_request_id': str(glob.room_request_id[r_id]), 'action': '1',
                           'wolf_id': u_id, 'object_id': o_id, 'result': 'true'}
                glob.room_wolf_select_num[r_id] = glob.room_wolf_select_num[r_id] + 1

        json = demjson.encode(message)
        send_message.send(r_id, json)

        if glob.room_wolf_select_num[r_id] == glob.room_aliver_wolf_num[r_id]:    #所有狼人都选完人
            if o_id != glob.room_protect_id[r_id]:      #不是被守护的人
                #杀了这个被选中的人
                player_state_change.kill(r_id, o_id)

            role = "wolf"
            message = {'type': '7', 'room_request_id': str(glob.room_request_id[r_id]),
                       'change': {o_id: "false"}, 'role': role}
            json = demjson.encode(message)
            send_message.send(r_id, json)
            #glob.room_request_content[r_id].append(json)
            glob.room_wolf_select[r_id] = {}

    elif act == '8':    #守卫
        if o_id != glob.room_protect_id[r_id]:
            glob.room_protect_id[r_id] = o_id
            message = {'type':'15', 'room_request_id': str(glob.room_request_id[r_id]), 'user_id':o_id}
            json = demjson.encode(message)
            glob.room_request_content[r_id].append(json)
        else:
            message['type'] = '1'
            message['room_request_id'] = str(glob.room_request_id[r_id])
            message['user_id'] = u_id
            message['error_message'] = 'error in guard the same person'
            json = demjson.encode(message)
            send_message.send(r_id, json)

    else:
        message['type'] = '1'
        message['room_request_id'] = str(glob.room_request_id[r_id])
        message['user_id'] = u_id
        message['error_message'] = 'error in action'
        json = demjson.encode(message)
        send_message.send(r_id, json)

    return