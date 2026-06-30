'use client'; 

import { MapContainer, TileLayer, Marker, Circle, useMap, Tooltip } from 'react-leaflet';
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
  area: "nayoro" | "kamikawa"; 
}

function MapRecenterController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    if (map && center && center[0] && center[1]) {
      map.stop(); 
      
      const timer = setTimeout(() => {
        try {
          map.flyTo(center, zoom, { duration: 1.2, animate: true });
        } catch (e) {
          map.setView(center, zoom, { animate: false });
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [center[0], center[1], zoom, map]);

  return null;
}

export default function Map({center, zoom, dangerLocations, area}: MapProps) {
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
        <MapRecenterController center={center} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 現在の area が "nayoro" の場合のみ、名寄の固定ピン群を描画する */}
        {area === "nayoro" && Locations.map((loc, index) => (
          <Marker key={`normal-${index}`} position={loc.pos as [number, number]}>
            <Tooltip permanent offset={[0, -25]}>{loc.name}</Tooltip>
          </Marker>
        ))}

        {area === "nayoro" && take_care_Locations.map((take_care, index) => (
          <Circle
            key={`take_care-${index}`}
            center={take_care.pos as [number, number]}
            radius={take_care.radius}
            pathOptions={{color: 'orange', fillColor: 'orange', fillOpacity: 0.3}}
          >
            <Tooltip permanent direction="right" offset={[20, 0]}>{take_care.name}</Tooltip>
          </Circle>
        ))}

        {dangerLocations.map((danger, index) => {
          if (!danger || !danger.lat || !danger.lon) return null;
          const currentRadius = danger.area_name === "nayoro" ? 300 : 3000;
          return (
            <Circle
              key={`danger-${danger.id || index}`}
              center={[danger.lat, danger.lon]}
              radius={currentRadius}
              pathOptions={{color: 'red', fillColor: 'red', fillOpacity: 0.3}}
            >
              <Tooltip permanent direction='right' offset={[20, 0]}>
                <strong> {danger.location_name}</strong>
              </Tooltip>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}