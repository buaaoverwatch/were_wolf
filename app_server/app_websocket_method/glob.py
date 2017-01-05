# -*- coding:UTF-8 -*-



#已登录用户
user_name = []




#房间信息
room_id = [0,0]       #未使用的房间号
room_request_id = {'room_id':0}			#房间号->房间请求的id，从0开始
room_open = {'room_id':True,'1':True}     #判定房间是否开发，可以加入
room_player_num = {'room_id':0,'1':3}		#房间号->房间人数         离开房间-1
room_mark = {'room_id':{'user_id':0}}				#房间号->{用户id，标记}  离开房间去掉
room_owner_id = {'room_id':'0',}      #房间号->房主id
room_player_seat = {'room_id':{'user_id':0},'1':{}}        #房主默认是1
room_role_number = {'room_id':{'role':0},'1':{'wolf':1}}  #房间号->{角色->角色个数}

#用户信息
user_request_id = {'user_id':0,'0':0,'1':0,'2':0}		#用户id -> 用户请求id
user_nick = {'user_id': 'null'}
user_role = {'user_id':'village'}    #用户id -> 用户角色
user_alive = {'user_id': 'true'}
user_room_id = {'user_id': -1}      #用户所在房间id


#下一步
room_next = {'room_id':[]}      #房间号->[用户id] 只要总数和活着的人对上就行

#狼人选人
room_wolf_select = {'room_id':{}}   #房间号->{狼人->被选者}
room_wolf_select_num = {'room_id':0}

#白天选人
room_day_select = {'room_id':{}}
room_day_select_num  = {'room_id':0}

#警长竞选
room_select_num = {'room_id':0}    #房间号->已经做选择的人数，全都选完后要清零 只要总数和活着的人对上就行
room_sheriff_list = {'room_id':[]} #房间号->[竞选者id]
room_sheriff_select = {'room_id':{}}   #房间号->{投票人->被选者}
room_sheriff_id = {'room_id':'sheriff_id'}

#存活情况
room_alive_num = {'room_id':0}
room_aliver_wolf_num = {'room_id': 0}      #房间号->狼人数
room_player_die = {'room_id':False}

#房间待发送的消息
room_request_content = {'room_id': []}      #房间号 -> [json1,json2]

#丘比特指定情侣
room_couples_id = {'room_id':[]}

#守卫守人，白天情况
room_protect_id = {'room_id':0}         #创房间时要有个初值