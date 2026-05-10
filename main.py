import folium as fm
import json
from branca.element import Element
from pathlib import Path

folium_map = fm.Map(location=[44.35, 142.46],zoom_start=15)

current_dir = Path.cwd()

json_data_file = current_dir / "data" / "data.json"
abs_data_file = current_dir / "data" / "abs_data.json"


print(json_data_file.name)

with open(abs_data_file, 'r',encoding='utf-8') as abs_json_open:
    abs_json_load = json.load(abs_json_open)

for abs_data in abs_json_load.values():
    abs_lat = abs_data['lat']
    abs_lon = abs_data['lon']
    abs_location_name = abs_data['name']

    fm.Marker(
        location=[abs_lat,abs_lon],
        tooltip = fm.Tooltip(abs_location_name,permanent=True,sticky=False),

        ).add_to(folium_map)

with open(json_data_file, 'r',encoding='utf-8') as json_open:
    json_load = json.load(json_open)


json_values = json_load['CASE1']['lat']

print(json_values)
print(type(json_values))


for case_data in json_load.values():
    lat = case_data['lat']
    lon = case_data['lon']
    location_name = case_data['memo']

    fm.Circle(
        location=[lat,lon],
        radius=50,
        tooltip = fm.Tooltip(location_name,permanent=True,sticky=False),
        color = "red",
        fill= True,
        fill_color="red",
        fill_opacity=0.3   
    ).add_to(folium_map)

    

fixed_panel_html = f"""
<div id="side-panel" style="
    position: fixed; 
    top: 20px; 
    right: 20px; 
    width: 600px;
    z-index: 9999;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 15px;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: sans-serif;
    ">
    <h4 style="margin-top:0;">最新ステータス</h4>
    <p><b>ダニ被害発生件数:</b> {len(json_load)}件</p>

</div>
"""
folium_map.get_root().html.add_child(Element(fixed_panel_html))
folium_map.save("riskmap.html")
