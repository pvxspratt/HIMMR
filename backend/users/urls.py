from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls
from .views import *

router = DefaultRouter()

router.register(r'all', UserViews.UserDetailViewSet, basename='all')
router.register(r'tags', TagViews.TagDetailView, basename='tags')
router.register(r'profiles', ProfileViews.ProfileDetailView, basename='profiles')
router.register(r'posts', PostCommentViews.PostDetailView, basename='posts')
router.register(r'comments', PostCommentViews.CommentDetailView, basename='comments')
router.register(r'listings', ListingViews.ListingDetailView, basename='listings')
router.register(r'notifications', NotificationViews.NotificationDetailView, basename='notifications')

urlpatterns = [
                  path('schema/', csrf_exempt(get_schema_view(
                      title='UsersAPI',
                      description='All API endpoints related to Users, Profiles, Tags and Match/Block Requests',
                      version='1.0.0'
                  ))),
                  path('docs/', include_docs_urls(title='UsersAPI')),

                  path('register/', csrf_exempt(UserViews.UserRegistrationView.as_view()), name='registration_view'),
                  path('login/', csrf_exempt(UserViews.UserLoginView.as_view()), name='login_view'),
                  path('login_google/', csrf_exempt(GoogleOauthView.as_view())),

                  path('forgot_password_init/', csrf_exempt(UserViews.UserForgotPasswordInitView.as_view()),
                       name='forgot_password_init'),
                  path('forgot_password_reset/<uid>/<token>/',
                       csrf_exempt(UserViews.UserPasswordTokenValidateView.as_view()),
                       name='forgot_password_reset'),
                  path('update_password/', csrf_exempt(UserViews.UserUpdatePasswordView.as_view()),
                       name='update_password'),

                  path('token/', csrf_exempt(TokenObtainPairView.as_view()), name='token_obtain_pair'),
                  path('token/refresh/', csrf_exempt(TokenRefreshView.as_view()), name='token_refresh'),

                  path('match_request/', RequestsViews.MatchRequestView.as_view(), name='match_request'),
                  path('block_request/', RequestsViews.BlockRequestView.as_view(), name='block_request'),

                  path('search/', SearchView.as_view(), name='search'),

                  # OAuth
                  # path('auth/', include('djoser.urls')),
                  # path('auth/', include('djoser.urls.jwt')),
                  # path('auth/', include('djoser.social.urls')),  # Needed for social authentication

              ] + router.urls
