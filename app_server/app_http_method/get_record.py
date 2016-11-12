# -*- coding:UTF-8 -*-
from app_db.models import standings
from django.core.exceptions import ObjectDoesNotExist


#返回数据  [{'win':win,'lose':lose},{'role':role,'result':result,'other_person':{....}},{},...]

def get(u_id):
    win_time = 0
    lose_time = 0
    message = []

    try:
        records = standings.objects.filter(user_id = u_id)
    except ObjectDoesNotExist:
        temp = {'win': win_time, 'lose': lose_time}
        message.append(temp)
        return message


    roles = []
    results = []
    other_persons = []

    for i in records:
        roles.append(i.role)
        results.append(i.result)
        other_persons.append(i.other_person)
        if i.result == 'true':
            win_time = win_time + 1
        else:
            lose_time = lose_time + 1


    temp = {'win':str(win_time),'lose':str(lose_time)}
    message.append(temp)
    for i in range(len(roles)):
        message.append({'role':roles[i],'result':results[i],'other_person':other_persons[i]})

    return message