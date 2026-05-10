import matplotlib.pyplot as plt
import cartopy.crs as ctp
import contextily as cntx
from pathlib import Path
import json

current_dir = Path.cwd()

json_data_file = current_dir / "data" / "data.json"


print(json_data_file.name)

with open(json_data_file, 'r',encoding='utf-8') as json_open:
    json_load = json.load(json_open)

json_values = json_load['CASE1']['lat']

print(json_values)
print(type(json_values))

lats = []
lons = []

for case_data in json_load.values():
    lats.append(case_data['lat'])
    lons.append(case_data['lon'])

print(lats)
print(lons)

fig = plt.figure(figsize=(8,8))
ax = fig.add_subplot(1,1,1,projection=ctp.Mercator())
ax.scatter(lons,lats, color='red',s=50,transform=ctp.PlateCarree())
margin = 0.002
ax.set_extent([min(lons) - margin, max(lons) + margin,
               min(lats) - margin, max(lats) +margin],
               crs=ctp.PlateCarree())

cntx.add_basemap(ax, zoom=15)

plt.show()