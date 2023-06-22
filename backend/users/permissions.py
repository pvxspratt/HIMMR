from rest_framework.permissions import BasePermission
from .models import *


class AllowUnauthenticatedGET(BasePermission):
    def has_permission(self, request, view):
        return request.method in ['GET']


class IsMatchedProfile(BasePermission):
    def has_permission(self, request, view):
        pass


class IsNotBlockedProfile(BasePermission):
    def has_permission(self, request, view):
        sender = request.user.username
        receiver_blocked_users = Profile.objects.get(auth_user=request.data['match_receiver']).blocked_users.all()
        return sender not in [blocked_user.username for blocked_user in receiver_blocked_users]
