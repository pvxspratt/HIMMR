from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils.encoding import smart_str
from .serializers import *
from .permissions import *
from .models import *
from .search import search

load_dotenv()


# User Model
class UserViews:
    """
    All User related views go here
    """

    class UserRegistrationView(GenericAPIView):
        authentication_classes = []
        permission_classes = [AllowAny]
        serializer_class = UserSerializers.UserRegisterSerializer

        def post(self, request):
            serializer = UserSerializers.UserRegisterSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_201_CREATED)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    class UserLoginView(GenericAPIView):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated]
        serializer_class = UserSerializers.UserLoginSerializer

        def post(self, request):
            serializer = UserSerializers.UserLoginSerializer(data=request.data)
            if serializer.is_valid():
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    class UserLogoutView(APIView):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated]

        def post(self, request):
            if 'refresh_token' not in request.data:
                return Response(data={'error': 'refresh token missing'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                refresh_token = RefreshToken(request.data['refresh_token'])
                refresh_token.blacklist()
            except TokenError as tk:
                return Response(data={'error': tk.__str__()}, status=status.HTTP_410_GONE)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(status=status.HTTP_200_OK)

    class UserDetailViewSet(viewsets.ViewSet):
        authentication_classes = []
        permission_classes = [AllowUnauthenticatedGET]
        queryset = User.objects.all()

        def list(self, request):
            try:
                serializer = UserSerializers.UserDetailSerializer(User.objects.all(), many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def retrieve(self, request, pk):
            try:
                user = get_object_or_404(User.objects.all(), username=pk)
                serializer = UserSerializers.UserDetailSerializer(user)
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    class UserForgotPasswordInitView(GenericAPIView):
        authentication_classes = []
        permission_classes = [AllowAny]

        def post(self, request):
            protocol = 'http' if 'on_local' in request.query_params and (request.query_params['on_local'][
                                                                             0] == 'true' or
                                                                         request.query_params['on_local'][
                                                                             0]) else 'https'
            serializer = UserSerializers.UserForgotPasswordSerializer(data=request.data,
                                                                      context={'request': request,
                                                                               'protocol': protocol})
            if serializer.is_valid():
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    class UserPasswordTokenValidateView(GenericAPIView):
        authentication_classes = []
        permission_classes = [AllowAny]

        def get(self, request, uid, token):
            try:
                uid_decoded = smart_str(urlsafe_base64_decode(uid))
                user = User.objects.get(id=uid_decoded)

                if not PasswordResetTokenGenerator().check_token(token=token, user=user):
                    return Response(data={'error': 'token expired, request a new one'}, status=status.HTTP_410_GONE)
                else:
                    return Response(
                        data={'message': 'user validated', 'uid': uid, 'token': token, 'username': user.username,
                              'email': user.email},
                        status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    class UserUpdatePasswordView(GenericAPIView):
        authentication_classes = []
        permission_classes = [AllowAny]

        def post(self, request):
            serializer = UserSerializers.UserUpdatePasswordSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProfileViews:
    """
    All Profile related views go here
    """

    class ProfileDetailView(viewsets.ViewSet):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated | AllowUnauthenticatedGET]
        queryset = Profile.objects.all()

        def list(self, request):
            try:

                q_set = self.filter_profiles(request.user.profile) if request.user else Profile.objects.all()
                serializer = ProfileSerializers.ProfileListSerializer(q_set,
                                                                      many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def retrieve(self, request, pk):
            profile = get_object_or_404(self.queryset, auth_user=User.objects.get(username=pk))
            serializer = ProfileSerializers.ProfileListSerializer(profile)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        def put(self, request):
            serializer = ProfileSerializers.ProfileUpdateSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def filter_profiles(self, profile):
            return Profile.objects.exclude(
                Q(blocked_users__id=profile.id) | Q(id=profile.id))


class RequestsViews:
    """
    All Block / Match request related Views go here
    """

    class MatchRequestView(GenericAPIView):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated]
        queryset = MatchRequest.objects.all()

        # Return sent and received match requests
        def get(self, request):
            try:
                serializer = RequestSerializers.MatchRequestListSerializer(data=request.data,
                                                                           context={'request': request})
                if serializer.is_valid():
                    return Response(data=serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def post(self, request):
            serializer = RequestSerializers.MatchRequestPostSerializer(data=request.data,
                                                                       context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def delete(self, request):
            try:
                unmatch_sender = request.user.profile
                unmatch_receiver = User.objects.get(username=request.data['unmatch_receiver']).profile
                Profile.delete_match(unmatch_sender, unmatch_receiver)
                return Response(status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    class BlockRequestView(GenericAPIView):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated]
        queryset = BlockRequest.objects.all()

        def get(self, request):
            try:
                user_profile = request.user.profile
                blocked_users = [blocked_profile.auth_user.username for blocked_profile in
                                 user_profile.blocked_users.all()]
                return Response(data=blocked_users, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def post(self, request):
            serializer = RequestSerializers.BlockRequestPostSerializer(data=request.data,
                                                                       context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def delete(self, request):
            try:
                unblock_sender = request.user.profile
                unblock_receiver = User.objects.get(username=request.data['unblock_receiver']).profile
                Profile.unblock_profile(unblock_sender, unblock_receiver)
                return Response(data={'message': 'user unblocked successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TagViews:
    """
        All Tag related views go here
    """

    class TagDetailView(viewsets.ViewSet):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated | AllowUnauthenticatedGET]
        queryset = Tag.objects.all()

        # Fetch All Tags
        def list(self, request):
            try:
                serializer = TagSerializers.TagListSerializer(self.queryset, many=True)
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def retrieve(self, request, pk):
            try:
                user_profile = User.objects.get(username=pk).profile
                return Response(data=[tag.name for tag in user_profile.tags.all()], status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Create User Tags
        def create(self, request):
            serializer = TagSerializers.TagCreateSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def delete(self, request):
            try:
                user_profile = request.user.profile
                for name in request.data['names']:
                    tag = Tag.objects.get(name=name, profile=user_profile)
                    tag.delete()
                return Response(data={'message': 'tags deleted successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PostCommentViews:
    """
           All Post/Comment related views go here
       """

    class PostDetailView(viewsets.ViewSet):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated | AllowUnauthenticatedGET]
        queryset = Post.objects.all()

        # Create Post
        def create(self, request):
            serializer = PostSerializers.PostCreateSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Get all Posts
        def list(self, request):
            try:

                queryset = Post.objects.get(
                    id=request.query_params['post_id']) if 'post_id' in request.query_params else Post.objects.all()
                serializer = PostSerializers.PostListSerializer(queryset,
                                                                many='post_id' not in request.query_params)
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Get posts by username
        def retrieve(self, request, pk):
            try:
                author = User.objects.get(username=pk).profile
                serializer = PostSerializers.PostListSerializer(Post.objects.filter(author=author), many=True)
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Update post
        def put(self, request):
            serializer = PostSerializers.PostUpdateSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Delete post
        def destroy(self, request, pk):
            try:
                post = Post.objects.get(id=int(pk))
                if post.author.auth_user.username != request.user.username:
                    return Response(data={'error': 'you do not have permission to delete this post'},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                post.delete()
                return Response(data={'message': 'post deleted successfully'}, status=status.HTTP_200_OK)

            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    class CommentDetailView(viewsets.ViewSet):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated | AllowUnauthenticatedGET]
        queryset = Comment.objects.all()

        # Create new comment on post
        def create(self, request):
            serializer = CommentSerializers.CommentCreateSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # get comments by post_id or comment_id (use this for comments and replies)
        def list(self, request):
            try:
                if 'post_id' in request.query_params:
                    related_post = Post.objects.get(id=request.query_params['post_id'])
                    queryset = Comment.objects.filter(post=related_post)
                else:
                    queryset = Comment.objects.get(id=request.query_params['comment_id'])

                serializer = CommentSerializers.CommentListSerializer(queryset,
                                                                      many=('post_id' in request.query_params))
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Update comment
        def put(self, request):
            serializer = CommentSerializers.CommentUpdateSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Delete comment
        def destroy(self, request, pk):
            try:
                comment = Comment.objects.get(id=int(pk))
                if comment.author != request.user.profile:
                    return Response(data={'error': 'you do not have permission to delete this comment'},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                comment.delete()
                return Response(data={'message': 'comment deleted successfully'}, status=status.HTTP_200_OK)

            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListingViews:
    class ListingDetailView(viewsets.ViewSet):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated | AllowUnauthenticatedGET]
        queryset = Listing.objects.all()

        def list(self, request):
            try:
                serializer = ListingSerializers.ListingGetSerializer(Listing.objects.all(), many=True)
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def retrieve(self, request, pk):
            listing = get_object_or_404(Listing.objects.all(), profile=User.objects.get(username=pk).profile)
            serializer = ListingSerializers.ListingGetSerializer(listing)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        def create(self, request):
            serializer = ListingSerializers.ListingPostSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def put(self, request):
            serializer = ListingSerializers.ListingUpdateSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def destroy(self, request, pk):
            try:
                listing = Listing.objects.get(id=int(pk))
                if listing.profile != request.user.profile:
                    return Response(data={'error': 'you do not have permission to delete this listing'},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                listing.delete()
                return Response(data={'message': 'listing deleted successfully'}, status=status.HTTP_200_OK)

            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class NotificationViews:
    class NotificationDetailView(viewsets.ViewSet):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated | AllowUnauthenticatedGET]
        queryset = Notification.objects.all()

        def list(self, request):
            queryset = Notification.objects.filter(for_user=request.user.profile).filter(read=False)[:10]
            try:
                serializer = NotificationSerializers.NotificationGetSerializer(queryset, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def put(self, request):
            try:
                notif = Notification.objects.get(id=request.data['id'])
                notif.read = True
                return Response(status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SearchView(GenericAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated | AllowUnauthenticatedGET]

    def post(self, request):
        try:
            query_results = search(request)
            return Response(data=query_results, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GoogleOauthView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            response_data = User.objects.authenticate_google_user(**request.data)
            print('resp', response_data)
            return Response(data=response_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e, e.__traceback__, type(e))
            return Response(data={'error': e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
