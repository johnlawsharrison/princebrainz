import json
import os
import requests

json_list = [];

for filename in os.listdir('ByrneBrainz/data'):
	with open('ByrneBrainz/data/{0}'.format(filename)) as data_file:
		song = json.load(data_file)
		track_id = song['metadata']['tags']['musicbrainz_trackid'][0]
		print("downloading highlevel data for: {0}".format(track_id))
		# get the highlevel data from abz api
		r = requests.get("https://acousticbrainz.org/api/v1/{0}/high-level".format(track_id))
		print(r.status_code)
		high_level = r.json()['highlevel']
		song['highlevel'] = high_level
		json_list.append(song)

with open('song-data.json', 'w') as outfile:
	print(len(json_list))
	json.dump(json_list, outfile)