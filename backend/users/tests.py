from unittest import TestCase
from .views import *
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from rest_framework_simplejwt.views import TokenObtainPairView

TEST_USER_CREDS = [(f'user{i}', f'pass{i}', f'user{i}@gmail.com') for i in range(1, 4)]


class UserTestCase(TestCase):

    def test_create_users(self):
        # create test user creds
        created_users = []
        for username, password, email in TEST_USER_CREDS:
            new_user = User.objects.create_user(username=username, password=password, email=email)
            created_users.append(new_user)  # populate new_users

        User.objects.create_user(username='un', email='em@test.com', password='pwd', first_name='fn',
                                 last_name='ln')
        self.assertEqual(User.objects.get(username='user1'), created_users[0])
        self.assertEqual(User.objects.get(email='user2@gmail.com'), created_users[1])
        self.assertEqual(User.objects.get(first_name='fn'), User.objects.get(username='un'))

    def test_delete_users(self):
        for user in User.objects.all():
            user.delete()
        self.assertEqual(User.objects.all().count(), 0)

    def test_create_profile_and_tags(self):
        auth_user = User.objects.create_user(username='testp', password='testp', email='test@email.com',
                                             first_name='Test', last_name='Test')
        user_profile = Profile.objects.get(auth_user=auth_user)

        tag1 = Tag.objects.create(name='something', profile=user_profile)
        tag2 = Tag.objects.create(name='anotherThing', profile=user_profile)
        user_tags = user_profile.tags

        self.assertEqual(user_tags.get(name='something').name, 'something')
        self.assertIn(tag1, user_tags.all())
        self.assertIsNotNone(tag2.name)
        self.assertEqual(user_profile.auth_user.username, 'testp')


class AuthAPITestCase(APITestCase):
    def test_reg_and_login(self):
        # User Registration
        factory = APIRequestFactory()
        req = factory.post('api/users/register/',
                           data={'username': 'test_user', 'email': 'test_email@test.com', 'password': 'test_pwd',
                                 'last_name': 'test_ln', 'gender': 'M'},
                           format='json')
        view = UserViews.UserRegistrationView.as_view()
        response = view(req)
        self.assertEqual(response.status_code, 201)

        # Fetch Access Token
        req = factory.post('api/users/token/', data={'username': 'test_user', 'password': 'test_pwd'}, format='json')
        view = TokenObtainPairView.as_view()
        response = view(req)
        self.assertIsNotNone(response.data['access'])
        self.assertIsNotNone(response.data['refresh'])
        http_auth = f'Authorization: Bearer {response.data["access"]}'

        # User Login Works
        req = factory.post('api/users/login/',
                           data={'username': 'test_user', 'password': 'test_pwd'},
                           format='json', HTTP_AUTHORIZATION=http_auth)
        force_authenticate(req, user=User.objects.get(username='test_user'))
        view = UserViews.UserLoginView.as_view()
        response = view(req)
        self.assertEqual(response.status_code, 200)

    def test_user_detail(self):
        for username, password, email in TEST_USER_CREDS:
            _ = User.objects.create_user(username=username, password=password, email=email)

        factory = APIRequestFactory()
        req = factory.get('api/users/all/', format='json')
        view = UserViews.UserDetailViewSet.as_view({'get': 'list'})
        response = view(req)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        req = factory.get('api/users/all/', format='json')
        view = UserViews.UserDetailViewSet.as_view({'get': 'retrieve'})
        response = view(req, pk='user1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual('user1@gmail.com', response.data['email'])

    def test_fetch_profiles(self):
        for username, password, email in TEST_USER_CREDS:
            User.objects.create_user(username=username, password=password, email=email)

        profile1 = User.objects.get(username='user1').profile
        profile2 = User.objects.get(username='user2').profile

        profile1.matches.add(profile2)
        profile2.matches.add(profile1)

        Tag.objects.create(name='something', profile=profile1)
        Tag.objects.create(name='anotherThing', profile=profile2)

        factory = APIRequestFactory()
        req = factory.get('api/users/profiles/', format='json')
        view = ProfileViews.ProfileDetailView.as_view({'get': 'retrieve'})
        response = view(req, pk='user1')
        print(response.data)
        self.assertEqual(response.status_code, 200)

        req = factory.get('api/users/profiles/', format='json')
        view = ProfileViews.ProfileDetailView.as_view({'get': 'retrieve'})
        response = view(req, pk='user2')
        print(response.data)
        self.assertEqual(response.status_code, 200)


class TagAPITestCase(AuthAPITestCase):
    def test_fetch_tags(self):
        auth_user = User.objects.create_user(username='testp', password='testp', email='test@email.com',
                                             first_name='Test', last_name='Test')
        user_profile = Profile.objects.get(auth_user=auth_user)

        for tag_name in ['abc', 'tag1', 'tag2', 'tag3']:
            Tag.objects.create(name=tag_name, profile=user_profile)

        # Fetch all Tags
        factory = APIRequestFactory()
        req = factory.get('api/users/tags/', format='json')
        view = TagViews.TagDetailView.as_view({'get': 'list'})
        response = view(req)
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 4)

        # Fetch Tags by Username
        req = factory.get('api/users/tags/', format='json')
        view = TagViews.TagDetailView.as_view({'get': 'retrieve'})
        response = view(req, pk=auth_user.username)
        print(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 4)

    def test_create_delete_tags(self):
        # Register and Login User
        factory = APIRequestFactory()
        req = factory.post('api/users/register/',
                           data={'username': 'test_user', 'email': 'test_email@test.com', 'password': 'test_pwd',
                                 'last_name': 'test_ln', 'gender': 'F'},
                           format='json')
        view = UserViews.UserRegistrationView.as_view()
        response = view(req)
        self.assertEqual(response.status_code, 201)

        req = factory.post('api/users/token/', data={'username': 'test_user', 'password': 'test_pwd'}, format='json')
        view = TokenObtainPairView.as_view()
        response = view(req)
        print(response.data)
        self.assertIsNotNone(response.data['access'])
        self.assertIsNotNone(response.data['refresh'])
        http_auth = f'Authorization: Bearer {response.data["access"]}'

        req = factory.post('api/users/login/',
                           data={'username': 'test_user', 'password': 'test_pwd'},
                           format='json', HTTP_AUTHORIZATION=http_auth)
        new_user = User.objects.get(username='test_user')
        force_authenticate(req, user=new_user)
        view = UserViews.UserLoginView.as_view()
        response = view(req)
        print(response.data)
        self.assertEqual(response.status_code, 200)

        # Create New Tags
        req = factory.post('api/users/tags/',
                           data={'names': ['tag1', 'tag2']},
                           HTTP_AUTHORIZATION=http_auth, format='json')
        force_authenticate(req, user=new_user)
        view = TagViews.TagDetailView.as_view({'post': 'create'})
        response = view(req)
        self.assertIsNotNone(Tag.objects.all())
        self.assertIsNotNone(response.data['names'])
        self.assertEqual(response.status_code, 200)

        # Delete Tags
        req = factory.delete('api/users/tags/',
                             data={'names': ['tag1', 'tag2']},
                             HTTP_AUTHORIZATION=http_auth, format='json')
        force_authenticate(req, user=new_user)
        view = TagViews.TagDetailView.as_view({'delete': 'delete'})
        response = view(req)
        print(response.data)
        self.assertEqual(Tag.objects.all().count(), 0)
        self.assertEqual(response.status_code, 200)


class ProfileRequestsTestCase(APITestCase):
    pass
