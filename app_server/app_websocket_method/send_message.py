# -*- coding:UTF-8 -*-
#向客户端发送数据

from channels import Group
from channels.sessions import channel_session
import glob

#用来检查某个房间内是否所有用户都收到了请求
def check(room_id):
    n = glob.room_player_num[room_id]
    mark = glob.room_mark[room_id]

    #有人没收到
    for i in mark.values():
        if i == 0 :
            return False

    #全都收到，复位
    glob.room_request_id[room_id] = glob.room_request_id[room_id] + 1
    Keys = mark.keys()
    for i in Keys:
        mark[i] = 0
    glob.room_mark[room_id] = mark
    return True


def send(room_id,message):

    while (check(room_id) != True):
        Group("room-%s" % room_id).send({
            "text": message,
        })


    return


