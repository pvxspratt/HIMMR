# from rest_framework.test import APIRequestFactory, APITestCase
# from .views import APIKeyView
#
#
# class UserTestCase(APITestCase):
#
#     def test_create_users(self):
#         factory = APIRequestFactory()
#         req = factory.get('api/fetch_api_key/')
#         view = APIKeyView.as_view()
#         response = view(req)
#         self.assertEqual(response.status_code, 200)
#         self.assertIsNotNone(response.data['himmr_api_key'])
