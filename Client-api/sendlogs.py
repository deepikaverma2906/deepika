import requests
import json
import datetime
import time

url = 'http://localhost:4101/api/v1/analytics/logs'  # Replace with the actual URL of the form submission endpoint
while True:
    form_data = {
        'timestamp': datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), 
        'CameraName': 'johndoe@example.com',
        'location': 'This is a test message',
        'CustomerName':'abc',
        'Lat':  22.01,
        'Long':  22.01,
        'Speed' : 40,
        "VehicleType":  "",
        "Vehicle_Color": "",
        "isSpeeding": "false",
        "isANPR": "false",
        "isWrongWay":"false" ,
        "isNoHelmet": "false",
        "isRLVD": "false",
        "isTripleRiding": "false",
        "VehicleMake": "",
        "vehicle_lpr_number": "" ,
        "vehicle_model": "",
        "LPNumber": "",
    

    }
    files = {} 
    files = {
        # 'IMAGEURL': open('./test.webp', 'rb'),
        'SnapshotURL': open('./test.webp', 'rb'),
        # 'LPImageURL': open('/path/to/file.pdf', 'rb'),
        # 'RLVDImageURL': open('/path/to/file.pdf', 'rb'),
        # 'VideoURL': open('/path/to/file.pdf', 'rb'),
    }


    response = requests.post(url, data=json.loads(json.dumps(form_data)), files=files)
    
    print(response.status_code)
    # Check the response status code
    if response.status_code == requests.codes.created:
        print('Form submitted successfully!')
    else:
        print('Failed to submit the form.')
    time.sleep(0.30)