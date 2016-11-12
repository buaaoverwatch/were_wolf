# -*- coding:UTF-8 -*-
from app_db.models import UserInfo
from django.core.exceptions import ObjectDoesNotExist

def updata(u_id, nick, password, intro):
    try:
        user = UserInfo.objects.get(id=int(u_id))
        user.nick_name = nick
        user.password = password
        user.introduce = intro
    except ObjectDoesNotExist:
        return 1

    return 0