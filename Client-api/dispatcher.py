from json.decoder import JSONDecodeError
import os
import sys
import json
import requests
import time
import logging
logging.basicConfig(level=logging.DEBUG,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')

INPUT_DIR  = sys.argv[1]
OUT_URL = sys.argv[2]





def main():
	os.chdir(INPUT_DIR)
	filenames = next(os.walk(INPUT_DIR), (None, None, []))[2]  # [] if no file
	filenames = [ i for i in filenames if i.endswith('.json')]

	logging.info ("Iterating Directory now ...")
	for logfile in filenames:
		try:
			log_data = ' '
			with open(logfile,'r') as f:
				log_data = f.read()
			log_data_dict = json.loads(log_data)
		
			form_data={
				'timestamp': log_data_dict['timestamp'] , 
				'CameraName': log_data_dict['CameraName'],
				'location': log_data_dict['location'],
				'CustomerName': 'BSCDCL',
				'Lat':  log_data_dict['Lat'],
				'Long': log_data_dict['Long'],
				'Speed' : log_data_dict['Speed'] if  'Speed' in log_data_dict  else None ,
				"VehicleType":  log_data_dict['VehicleType'] if  'VehicleType' in log_data_dict  else None ,
				"Vehicle_Color": log_data_dict['Vehicle_Color'] if  'Vehicle_Color' in log_data_dict  else None,
				"isSpeeding": log_data_dict['isSpeeding'] if  'isSpeeding' in log_data_dict else "false",
				"isANPR": log_data_dict['isANPR'] if  'isANPR' in log_data_dict  else "false",
				"isWrongWay":log_data_dict['isWrongWay'] if  'isWrongWay' in log_data_dict  else "false",
				"isNoHelmet": log_data_dict['isNoHelmet']if  'isNoHelmet' in log_data_dict  else "false" ,
				"isRLVD": log_data_dict['isRLVD'] if 'isRLVD' in log_data_dict else "false",
				"isTripleRiding": log_data_dict['isTripleRiding'] if  'isTripleRiding' in log_data_dict else "false" ,
				"VehicleMake": log_data_dict['VehicleMake'] if  'VehicleMake' in log_data_dict else None,
				"vehicle_lpr_number":log_data_dict['vehicle_lpr_number'] if  'vehicle_lpr_number' in log_data_dict  else None ,
				"vehicle_model": log_data_dict['vehicle_model'] if  'vehicle_model' in log_data_dict   else None ,
				"LPNumber": log_data_dict['LPNumber'] if  'LPNumber' in log_data_dict  else None,
			}
			
			files = {}

			if 'SnapshotURL' in log_data_dict  :
				files ["SnapshotURL"] = open(log_data_dict['SnapshotURL'], 'rb')
			if 'LPImageURL'  in log_data_dict:
				files ["LPImageURL"] = open(log_data_dict['LPImageURL'], 'rb')
			if 'RLVDImageURL' in log_data_dict :
				files ["RLVDImageURL"] = open(log_data_dict['RLVDImageURL'], 'rb')
			if 'VideoURL' in log_data_dict :
				files ["VideoURL"] = open(log_data_dict['VideoURL'], 'rb')
	
			logging.info("Sending output ------------>" + json.dumps(form_data) + " to ------------> " + OUT_URL)
			r = requests.post(OUT_URL, data=json.loads(json.dumps(form_data)), files=files , verify=False)
			logging.info("Response Receieved " + str(r))
			if r.status_code == 201:
				os.remove(logfile)
				if 'SnapshotURL' in log_data_dict  :
					os.remove(log_data_dict['SnapshotURL'])
				if 'LPImageURL'  in log_data_dict:
					os.remove(log_data_dict['LPImageURL'])
				if 'RLVDImageURL' in log_data_dict :
					os.remove(log_data_dict['RLVDImageURL'])
				if 'VideoURL' in log_data_dict :
					os.remove(log_data_dict['VideoURL'])
				logging.info("Sucessfully Uploaded the Records and Deleted the localFiles"+ str(r.status_code))

			else:
				logging.error(r.status_code)
		except UnicodeDecodeError as json_error:
			os.remove(logfile)
		except JSONDecodeError :
			os.remove(logfile)
		except requests.exceptions.ConnectionError:
			time.sleep(2)
			continue
		except KeyboardInterrupt:
			print("exiting...")
			exit()
	return 1
if __name__ == '__main__' :
	main()
	
