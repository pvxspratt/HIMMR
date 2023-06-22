# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework_api_key.models import APIKey
# from rest_framework.permissions import AllowAny
# from rest_framework import status
#
#
# class APIKeyView(APIView):
#     permission_classes = [AllowAny]
#     authentication_classes = []
#
#     def get(self, request):
#         _, api_key = APIKey.objects.create_key(name='himmr_api_key')
#         return Response({'himmr_api_key': api_key}, status=status.HTTP_200_OK)
