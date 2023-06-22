from django.urls import path, include
from django.contrib import admin

# from .views import APIKeyView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    # path('api/key/', csrf_exempt(APIKeyView.as_view()))
]
