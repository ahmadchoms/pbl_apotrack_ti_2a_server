import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Vite/Webpack
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

function RecenterMap({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position);
        }
    }, [position]);
    return null;
}

export function LocationPicker({ lat, lng, onChange }) {
    const initialPosition = lat && lng ? { lat, lng } : { lat: -6.200000, lng: 106.816666 }; // Default Jakarta
    const [position, setPosition] = React.useState(lat && lng ? initialPosition : null);

    const handleSetPosition = (pos) => {
        setPosition(pos);
        onChange(pos.lat.toFixed(6), pos.lng.toFixed(6));
    };

    return (
        <div className="w-full h-[400px] rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner relative z-0">
            <MapContainer
                center={initialPosition}
                zoom={13}
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={handleSetPosition} />
                <RecenterMap position={position} />
            </MapContainer>
            
            {!position && (
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center z-[1000] pointer-events-none">
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-[#0b3b60] border border-slate-200">
                        Klik pada peta untuk menentukan lokasi
                    </div>
                </div>
            )}
        </div>
    );
}
