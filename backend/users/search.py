from django.db.models import Q
from .serializers import *


def search(request):
    response_data = {}
    q = request.query_params['Q']

    if 'profiles' in request.data and request.data['profiles']:
        response_data['profiles'] = search_profiles(q)

    if 'posts' in request.data and request.data['posts']:
        response_data['posts'] = search_posts(q)

    if 'comments' in request.data and request.data['comments']:
        response_data['comments'] = search_comments(q)

    if 'tags' in request.data and request.data['tags']:
        response_data['tags'] = search_tags(q)

    if 'listings' in request.data and request.data['listings']:
        response_data['listings'] = search_listings(q)

    return response_data


def search_profiles(q):
    queryset = Profile.objects.filter(
        Q(auth_user__username__icontains=q) |
        Q(auth_user__first_name__icontains=q) |
        Q(auth_user__last_name__icontains=q) |
        Q(bio__icontains=q) |
        Q(tags__name__icontains=q)
    ).distinct()

    serializer = ProfileSerializers.ProfileListSerializer(queryset, many=True)
    return serializer.data


def search_posts(q):
    queryset = Post.objects.filter(
        Q(title__icontains=q) |
        Q(body__icontains=q) |
        Q(author__auth_user__username__icontains=q)
    ).distinct()
    serializer = PostSerializers.PostListSerializer(queryset, many=True)
    return serializer.data


def search_comments(q):
    queryset = Comment.objects.filter(
        Q(body__icontains=q) |
        Q(author__auth_user__username__icontains=q) |
        Q(author__auth_user__first_name__icontains=q) |
        Q(author__auth_user__last_name__icontains=q)
    ).distinct()
    serializer = CommentSerializers.CommentListSerializer(queryset, many=True)
    return serializer.data


def search_tags(q):
    queryset = Tag.objects.filter(
        Q(name__icontains=q) |
        Q(profile__auth_user__username__icontains=q) |
        Q(profile__auth_user__first_name__icontains=q) |
        Q(profile__auth_user__last_name__icontains=q)
    ).distinct()
    serializer = TagSerializers.TagListSerializer(queryset, many=True)
    return serializer.data


def search_listings(q):
    queryset = Listing.objects.filter(
        Q(name__icontains=q) |
        Q(street1__icontains=q) |
        Q(street2__icontains=q) |
        Q(city__icontains=q) |
        Q(state__icontains=q) |
        Q(country__icontains=q) |
        Q(zipcode__icontains=q)
    ).distinct()
    serializer = ListingSerializers.ListingGetSerializer(queryset, many=True)
    return serializer.data
