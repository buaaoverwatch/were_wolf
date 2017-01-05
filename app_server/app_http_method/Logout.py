from app_websocket_method import glob
from app_db.models import RoomInfo
from app_websocket_method import close_room

def logout(u_id,_name):
    if _name in glob.user_name:
        del glob.user_name[glob.user_name.index(_name)]
        if u_id in glob.user_nick.keys():
            del glob.user_nick[u_id]
        if u_id in glob.user_request_id.keys():
            del glob.user_request_id[u_id]
        if u_id in glob.user_role.keys():
            del glob.user_role[u_id]
        if u_id in glob.user_alive.keys():
            del glob.user_alive[u_id]
        rooms = RoomInfo.objects.all().values_list('room_id', 'owner_id')
        for r in rooms:
            if r[1] == u_id:
                close_room.close(r[0],-1)
    return 0
