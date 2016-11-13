from app_db.models import RoomInfo
from app_db.models import standings
import glob

def close(r_id,result):

    #修改glob


    #修改数据库
    room = RoomInfo.objects.get(room_id = r_id)
    id_list = room.player_id.split(',')
    role_list = room.player_role.split(',')
    room.delete()

    #for i in range(len(id_list)):
        #if result == 0 and role_list[i] == 'wolf':
            #record = standings(user_id = id_list[i],role = role_list[i],result = 'true',room.player_id)
        #elif result == 1 and role_list[i] != 'wolf':
            # record = standings(user_id = id_list[i],role = role_list[i],result = 'true',room.player_id)
        #elif result == 3 and (role_list[i] == 'cupid' or role_list[i] in glob.room_couples_id[r_id]):
            # record = standings(user_id = id_list[i],role = role_list[i],result = 'true',room.player_id)
        #else:
            # record = standings(user_id = id_list[i],role = role_list[i],result = 'false',room.player_id)
        #record.save()

    return