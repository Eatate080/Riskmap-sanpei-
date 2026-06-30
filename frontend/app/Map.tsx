'use client'; 

import { MapContainer, TileLayer, Marker, Popup, Circle ,useMap,Tooltip } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;


interface MapProps {
  center: [number, number];
  zoom: number;
  dangerLocations: any[];
}

function ChangeMapViewController({ center, zoom }: Omit<MapProps, 'dangerLocations'>){
    const map = useMap();

    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.setView(center, zoom, { animate: true });
        }
    },[center, zoom ,map]);
    return null;
}

export default function Map({center, zoom, dangerLocations}: MapProps) {
  const Locations = [
    { name: "名寄市役所", pos: [44.35584089855543, 142.46322355510256] },
    { name: "さんぺい動物病院", pos: [44.334059252998145, 142.4568938770911] }
  ];
  const take_care_Locations = [
    { area_name:"nayoro" ,name: "名寄公園（草むら注意）", pos: [44.34261176180942, 142.46983941294894], radius: 300 }
  ];

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        {/*カメラコントローラーを設置*/}
        <ChangeMapViewController center={center} zoom={zoom} />

        {/* 背景の地図 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 町のロケーションを描画*/}
        {Locations.map((loc,index) => (
            <Marker 
            key={`normal-${index}`} 
            position={loc.pos as [number,number]}
            >
                <Tooltip
                    permanent
                    offset={[0,-25]}
                >
                    {loc.name}
                </Tooltip>
            </Marker>
        ))}

        {/* 常に気をつけるべき場所 */}
        {take_care_Locations.map((take_care,index) => {
            const currentRadius = take_care.area_name === "nayoro" ? 300 : 3000;
            return(
                <Circle
                    key={`take_care-${index}`}
                    center={take_care.pos as [number,number]}
                    radius={take_care.radius}
                    pathOptions={{color: 'red', fillColor: 'red', fillOpacity:0.3}}
                >
                    <Tooltip 
                        permanent 
                        direction="right" 
                        offset={[20, 0]} 
                    >
                        {take_care.name}
                    </Tooltip>
                </Circle>

            );
        })}

        {dangerLocations.map((danger, index) =>{
            const currentRadius = danger.area_name === "nayoro" ? 300:3000;

            return (
                <Circle
                    key={`danger-${danger.id || index}`}
                    center={[danger.lat,danger.lon]}
                    radius={currentRadius}
                    pathOptions={{color: 'red',fillColor: 'red', fillOpacity:0.3}}
                >
                    <Tooltip>
                        <strong> {danger.location_name}</strong>
                        
                    </Tooltip>
                </Circle>
            );
        })}
      </MapContainer>
    </div>
  );
}