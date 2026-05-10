import matplotlib as plt
import cartopy as ctp
import contextily as cntx
from pathlib import Path
import json

current_dir = Path.cwd()

json_data_file = current_dir / "data" / "data.json"


print(json_data_file.name)

json_open = open(json_data_file, 'r',encoding='utf-8')
json_load = json.load(json_open)

json_values = json_load['CASE1']['ID']

print(json_values)
print(type(json_values))