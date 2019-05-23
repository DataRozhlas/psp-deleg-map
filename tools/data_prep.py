#%%
import requests
import pandas as pd
import unicodedata
import json
import time
import xml.etree.ElementTree as ET

#%%
def jungmann_fuck(txt):
    nfkd = unicodedata.normalize('NFKD', txt)
    return u"".join([c for c in nfkd if not unicodedata.combining(c)])
#%%
d = pd.read_csv('./tools/psp-delegace.csv')

#%%
locs = []
out = {}
for row in d.to_dict(orient='index').values():
    trip_id = row['usneseni'] + '_' + str(row['kategorie']) + '_' + str(row['cislo'])
    place = jungmann_fuck(str(row['mesto']) + '_' + row['zeme']).lower()

    if place not in out:
        out[place] = {}
        locs.append({
            'name': str(row['mesto']) + ', ' + row['zeme'],
            'uid': place,
            'lat': None,
            'lon': None,
            'trips': 0,
            'mps': 0,
        })
    if trip_id not in out[place]:
        out[place][trip_id] = []
    out[place][trip_id].append(row)

#%%
for loc in out:
    list(filter(lambda x: x['uid'] == loc, locs))[0]['trips'] = len(out[loc])
    for deleg in out[loc]:
        list(filter(lambda x: x['uid'] == loc, locs))[0]['mps'] += len(list(filter(lambda y: y['nahradnik'] == 'F', out[loc][deleg])))

#%%
with open('./js/data.js', 'w', encoding='utf-8') as f:
    f.write('export const data = ' + json.dumps(out, ensure_ascii=False) + ';')

#%%
for loc in locs:
    time.sleep(0.25)
    r = requests.get('https://api.mapy.cz/geocode?query=' + loc['name'])
    root = ET.fromstring(r.text)
    loc['lat'] = float(root[0][0].attrib['y'])
    loc['lon'] = float(root[0][0].attrib['x'])

#%%
with open('./js/locs.js', 'w', encoding='utf-8') as f:
    f.write('export const locs = ' + json.dumps(locs, ensure_ascii=False) + ';')
