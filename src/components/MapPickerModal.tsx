import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import L from 'leaflet';
import type { LeafletMouseEvent, Map as LeafletMap, Marker, DragEndEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

const MapPickerModal: React.FC<MapPickerModalProps> = ({ 
  isOpen, 
  onClose, 
  onLocationSelect,
  initialLocation 
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(initialLocation || null);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  // Clean up map instance
  const cleanupMap = () => {
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }
  };

  // Initialize map when modal opens
  useEffect(() => {
    if (!isOpen || !mapRef.current) {
      // Clean up when modal closes
      if (!isOpen) {
        cleanupMap();
      }
      return;
    }

    // Clean up previous map instance
    cleanupMap();

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!mapRef.current) return;

      // Create new map instance
      const defaultCenter = selectedLocation || { lat: -6.2088, lng: 106.8456 }; // Default to Jakarta
      const map = L.map(mapRef.current).setView([defaultCenter.lat, defaultCenter.lng], 12);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add click listener to select location
      map.on('click', (event: LeafletMouseEvent) => {
        const location = {
          lat: event.latlng.lat,
          lng: event.latlng.lng
        };
        setSelectedLocation(location);
        
        // Remove existing marker if any
        if (markerRef.current) {
          markerRef.current.remove();
        }
        
        // Add new marker
        const marker = L.marker([location.lat, location.lng], {
          draggable: true
        }).addTo(map);
        
        markerRef.current = marker;
        
        // Add dragend event to marker
        marker.on('dragend', (e: DragEndEvent) => {
          const newPosition = (e.target as Marker).getLatLng();
          setSelectedLocation({
            lat: newPosition.lat,
            lng: newPosition.lng
          });
          reverseGeocode(newPosition.lat, newPosition.lng);
        });
        
        reverseGeocode(location.lat, location.lng);
      });

      // Add initial marker if location is provided
      if (selectedLocation) {
        const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
          draggable: true
        }).addTo(map);
        
        markerRef.current = marker;
        
        marker.on('dragend', (e: DragEndEvent) => {
          const newPosition = (e.target as Marker).getLatLng();
          setSelectedLocation({
            lat: newPosition.lat,
            lng: newPosition.lng
          });
          reverseGeocode(newPosition.lat, newPosition.lng);
        });
      }

      mapInstance.current = map;
    }, 100);

    return () => {
      clearTimeout(timer);
      // Clean up when component unmounts or effect re-runs
      cleanupMap();
    };
  }, [isOpen, selectedLocation]);

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      setAddress('Error fetching address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect({
        ...selectedLocation,
        address
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Select Location</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Selected Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Click on the map to select a location"
            />
          </div>
          
          <div 
            ref={mapRef}
            className="w-full h-96 bg-gray-200 rounded-lg mb-4"
          >
            {/* Map will be initialized here */}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedLocation || isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Confirm Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPickerModal;