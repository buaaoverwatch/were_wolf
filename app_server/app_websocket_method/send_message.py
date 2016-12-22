# -*- coding:UTF-8 -*-
#向客户端发送数据

from channels import Group
import demjson
import glob
import time

#用来检查某个房间内是否所有用户都收到了请求
def check(r_id):
    n = glob.room_player_num[r_id]
    mark = glob.room_mark[r_id]

    #有人没收到
    for i in mark.values():
        if i == 0 :
            return False

    #全都收到，复位
    glob.room_request_id[r_id] = glob.room_request_id[r_id] + 1
    Keys = mark.keys()
    for i in Keys:
        mark[i] = 0
    glob.room_mark[r_id] = mark
    return True

def send_error(r_id):
    i = 0
    mark = glob.room_mark[r_id]
    id_list = []
    for i in range(len(mark.values())):
        if mark.values()[i] == 0 :
            id_list.append(mark.keys()[i])
    if len(id_list) != 0:
        message = {'type': '20', 'room_request_id': str(glob.room_request_id[r_id]), 'id_list': id_list}
        json = demjson.encode(message)
        while(i<3):
            Group("room-%s" % r_id).send({
                "text": json,
            })
            i=i+1
            time.sleep(1)


def send(r_id,message):
    send_mark = 0

    l_m = message
    while (check(r_id) != True):
        if send_mark < 5:
            Group("room-%s" % r_id).send({
                "text": l_m,
            })
            send_mark = send_mark + 1
        else:
            send_error(r_id)
            break
        time.sleep(1)
    return


