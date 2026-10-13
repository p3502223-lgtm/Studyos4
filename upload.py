import urllib.request
import json
import os

with open('StudyOS4.tar.gz', 'rb') as f:
    data = f.read()

req = urllib.request.Request('https://transfer.sh/StudyOS4.tar.gz', data=data, method='PUT')
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except Exception as e:
    print(f"Failed: {e}")
