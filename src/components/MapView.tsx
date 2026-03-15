'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import Link from 'next/link';

// Fix for leaflet icons in Next.js
const customIcon = new Icon({
  iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
  iconSize: [38, 38],
});

export default function MapView({ kgs }: { kgs: any[] }) {
  // Safe center calculation
  const validKg = kgs.find(k => k.lat && k.lng);
  const center = validKg ? [validKg.lat, validKg.lng] : [41.311081, 69.240562];

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200">
      <MapContainer center={center as any} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {kgs.map((kg) => {
          if (!kg.lat || !kg.lng) return null;
          return (
            <Marker key={kg.id} position={[kg.lat, kg.lng]} icon={customIcon}>
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-sm mb-1">{kg.name}</p>
                  <p className="text-xs text-gray-600 mb-2">{kg.status}</p>
                  <Link 
                    href={`/kindergarten/${kg.id}`}
                    className="text-xs font-bold text-green-600 hover:underline"
                  >
                    Подробнее
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
