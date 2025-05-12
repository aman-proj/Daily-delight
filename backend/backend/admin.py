from django.contrib import admin
from .models import User
from .models import Posts

admin.site.register(User)
admin.site.register(Posts)
