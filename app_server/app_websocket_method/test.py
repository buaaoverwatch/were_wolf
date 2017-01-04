from app_db.models import UserInfo
from django.core.exceptions import ObjectDoesNotExist

try:
    users = UserInfo.objects.filter(user_name__icontains='t')
    print users

except ObjectDoesNotExist:
    print 'none'
