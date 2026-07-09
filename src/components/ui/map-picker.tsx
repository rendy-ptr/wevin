'use client';

import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

// Fix for leaflet markers not loading properly in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({
  position,
  setPosition,
}: {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

interface MapPickerProps {
  onLocationSelect: (url: string) => void;
  onClose: () => void;
}

export default function MapPicker({
  onLocationSelect,
  onClose,
}: MapPickerProps) {
  // Default center (Jakarta)
  const [position, setPosition] = useState<[number, number] | null>(null);

  const handleSave = () => {
    if (position) {
      const url = `https://www.google.com/maps?q=${position[0]},${position[1]}`;
      onLocationSelect(url);
      onClose();
    }
  };

  // We must return null on server to avoid window is not defined
  if (typeof window === 'undefined') return null;

  return (
    <div className="space-y-4">
      <div className="border-border h-[350px] w-full overflow-hidden rounded-xl border">
        <MapContainer
          center={[-6.2, 106.816666]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button onClick={handleSave} disabled={!position}>
          <MapPin className="mr-2 h-4 w-4" />
          Simpan Lokasi
        </Button>
      </div>
    </div>
  );
}
