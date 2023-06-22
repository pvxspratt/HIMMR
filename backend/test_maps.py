import geocoder
import os
from dotenv import load_dotenv
import googlemaps as gmaps
import json
import requests

load_dotenv()
KEY = os.getenv('GOOGLE_MAPS_API_KEY')
SIGNATURE = os.getenv('GOOGLE_MAPS_API_SIGN')
lat_long = geocoder.ip('me').latlng
lat, long = str(lat_long[0]), str(lat_long[1])
gmap_client = gmaps.Client(key=KEY)
params = {'key': KEY, 'signature': SIGNATURE, 'size': '400x400', 'center': f'{lat},{long}'}
r = requests.get(url='https://maps.googleapis.com/maps/api/staticmap',
                 params=params)
print(r.request.url)
