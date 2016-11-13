# -*- coding:UTF-8 -*-
import demjson

import assign_role
import glob
import send_message
import methods
import actions


#   成功发送请求后 glob.room_request_id++
def process(data):

    type = data['type']
    room_id = data['room_id']
    user_id = data['user_id']

    message = {}
    #处理确认消息
    if type == '0':
        print 3
        r_request_id = data['room_request_id']
        if int(r_request_id) == glob.room_request_id[room_id]:
            glob.room_mark[room_id][user_id] = 1
        return
    #非确认消息
    request_id = data['request_id']
    #判断该请求是否已被处理
    if int(request_id) < glob.user_request_id[user_id]:
        return
    elif request_id > glob.user_request_id[user_id]:
        message['type'] = '1'
        message['room_request_id'] = str(glob.room_request_id[room_id])
        message['user_id'] = user_id
        message['error_message'] = 'error in request_id'
        json = demjson.encode(message)
        send_message.send(room_id, json)
        return
    else:
        print 4
        glob.user_request_id[user_id] = glob.user_request_id[user_id] + 1


    if type == '1':
        if methods.lock_room(room_id,user_id) == False:
            message['type'] = '1'
            message['room_request_id'] = str(glob.room_request_id[room_id])
            message['user_id'] = user_id
            message['error_message'] = 'error in lock room'
            json = demjson.encode(message)
            send_message.send(room_id, json)
    elif type == '2':
        seat = data['seat']
        methods.select_seat(room_id,user_id,seat)
    elif type == '3':
        assign_role.assign(data)
    elif type == '4':
        num = data['need_num']
        methods.next_step(room_id,user_id,num)
    elif type == '5':
        object_id = data['object_id']
        act = data['action']
        con = data['content']
        actions.action(room_id,user_id,object_id,act,con)
    elif type == '6':
        she = data['sheriff']
        methods.join_compaign_sheriff(room_id,user_id,she)
    elif type == '7':
        object_id = data['object_id']
        methods.sheriff_vote(room_id,user_id,object_id)
    elif type == '8':
        methods.leave(room_id, user_id)

    elif type == '9':
        object1_id = data['object1_id']
        object2_id = data['object2_id']
        methods.connet_couples(room_id,user_id,object1_id,object2_id)

    elif type == '100':
        seat = data['seat']
        methods.test(room_id, user_id, seat)

    return
