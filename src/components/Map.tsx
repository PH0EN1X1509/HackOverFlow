
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center?: [number, number];
  markers?: Array<{
    position: [number, number];
    tooltip: string;
    type?: 'donor' | 'recipient' | 'volunteer';
  }>;
  height?: string;
  className?: string;
}

const defaultMarkers: Array<{
  position: [number, number];
  tooltip: string;
  type: 'donor' | 'recipient' | 'volunteer';
}> = [
  {
    position: [34.0522, -118.2437],
    tooltip: "Fresh Harvest Bakery",
    type: 'donor'
  },
  {
    position: [34.0400, -118.2700],
    tooltip: "Downtown Shelter",
    type: 'recipient'
  },
  {
    position: [34.0300, -118.2200],
    tooltip: "Community Food Bank",
    type: 'recipient'
  },
  {
    position: [34.0600, -118.2900],
    tooltip: "City Catering Co.",
    type: 'donor'
  },
  {
    position: [34.0700, -118.2300],
    tooltip: "Volunteer: Alex Smith",
    type: 'volunteer'
  }
];

const Map = ({ 
  center = [34.0522, -118.2437], 
  markers = defaultMarkers,
  height = "400px",
  className = "" 
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Initialize map
    const map = L.map(mapRef.current).setView(center, 13);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add markers
    markers.forEach(marker => {
      const { position, tooltip, type = 'donor' } = marker;
      
      // Define custom icon based on type
      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="w-8 h-8 rounded-full flex items-center justify-center text-white ${
          type === 'donor' 
            ? 'bg-foodshare-500' 
            : type === 'recipient' 
              ? 'bg-purple-500' 
              : 'bg-green-500'
        }">
          ${
            type === 'donor' 
              ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z"/></svg>' 
              : type === 'recipient' 
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="M7.5 4.27l9 5.15"/><path d="M3.29 7 12 12l8.71-5"/><path d="M12 22V12"/></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>'
          }
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
      
      const newMarker = L.marker(position, { icon: markerIcon }).addTo(map);
      
      if (tooltip) {
        newMarker.bindPopup(`
          <div class="text-sm font-medium">${tooltip}</div>
          <div class="text-xs text-gray-500">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
        `);
      }
    });
    
    // Save the map instance
    mapInstanceRef.current = map;
    
    // Invalidate map size when it becomes visible
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
    
    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, markers]);

  return (
    <div className={`overflow-hidden rounded-lg border border-border/70 ${className}`}>
      <div ref={mapRef} style={{ height }} className="z-10"></div>
    </div>
  );
};

export default Map;
