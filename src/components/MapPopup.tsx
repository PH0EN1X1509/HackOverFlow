import { useEffect, useRef, useState } from "react";
import L from "leaflet";

interface MapPopupProps {
  onSelectLocation: (lat: number, lng: number) => void;
  onClose: () => void;
}

const MapPopup: React.FC<MapPopupProps> = ({ onSelectLocation, onClose }) => {
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Initialize the Leaflet map
    leafletMap.current = L.map(mapRef.current, {
      center: [28.6139, 77.2090], // Default center (Delhi)
      zoom: 12,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap.current);

    // Click event to get coordinates
    leafletMap.current.on("click", (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      setSelectedCoords({ lat, lng });

      // Remove previous marker and add new one
      L.marker([lat, lng]).addTo(leafletMap.current!).bindPopup("Selected Location").openPopup();
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  const handleConfirm = () => {
    if (selectedCoords) {
      onSelectLocation(selectedCoords.lat, selectedCoords.lng);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-[500px]">
        <h3 className="text-lg font-semibold mb-2">Select Location</h3>
        
        {/* Leaflet Map Container */}
        <div ref={mapRef} className="h-[300px] w-full rounded border" />

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button 
            onClick={handleConfirm} 
            className={`px-4 py-2 rounded ${selectedCoords ? "bg-foodshare-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            disabled={!selectedCoords}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPopup;
