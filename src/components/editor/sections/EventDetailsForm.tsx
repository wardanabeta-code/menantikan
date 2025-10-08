import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import MapPickerModal from '@/components/MapPickerModal';
import type { EventDetails, EventInfo } from '@/types';

interface EventDetailsFormProps {
  data?: Partial<EventDetails>;
  onChange: (eventType: 'ceremony' | 'reception', field: string, value: any) => void;
}

const EventDetailsForm: React.FC<EventDetailsFormProps> = ({ data, onChange }) => {
  // Determine initial event configuration based on existing data
  const getInitialEventConfig = () => {
    if (data?.ceremony && data?.reception) {
      // Check if it's Islamic (Akad) or non-Islamic (Pemberkatan)
      if (data.ceremony.name?.toLowerCase().includes('akad')) {
        return 'akad-resepsi';
      } else {
        return 'pemberkatan-resepsi';
      }
    } else if (data?.ceremony) {
      if (data.ceremony.name?.toLowerCase().includes('akad')) {
        return 'akad';
      } else {
        return 'pemberkatan';
      }
    } else if (data?.reception) {
      return 'resepsi';
    }
    return 'akad-resepsi'; // Default
  };

  const [eventConfig, setEventConfig] = useState(getInitialEventConfig());
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [currentEventType, setCurrentEventType] = useState<'ceremony' | 'reception'>('ceremony');

  // Update event configuration when data changes
  useEffect(() => {
    setEventConfig(getInitialEventConfig());
  }, [data]);

  const handleEventChange = (eventType: 'ceremony' | 'reception', field: string, value: any) => {
    onChange(eventType, field, value);
  };

  // Handle event configuration change
  const handleEventConfigChange = (config: string) => {
    setEventConfig(config);
  };

  // Handle location selection from map picker
  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    // Store coordinates in the coordinates field
    handleEventChange(currentEventType, 'coordinates', {
      lat: location.lat,
      lng: location.lng
    });
    
    // Store address in the address field
    handleEventChange(currentEventType, 'address', location.address);
    
    // Generate and store Google Maps URL in notes field
    const googleMapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    const currentNotes = data?.[currentEventType]?.notes || '';
    // Preserve any existing notes but add the map URL
    const notesWithMapUrl = currentNotes 
      ? `${currentNotes}\nmapUrl:${googleMapsUrl}` 
      : `mapUrl:${googleMapsUrl}`;
    handleEventChange(currentEventType, 'notes', notesWithMapUrl);
    
    setIsMapPickerOpen(false);
  };

  // Open map picker for a specific event type
  const openMapPicker = (eventType: 'ceremony' | 'reception') => {
    setCurrentEventType(eventType);
    setIsMapPickerOpen(true);
  };

  // Extract Google Maps URL from notes
  const getMapUrl = (notes: string | undefined) => {
    if (!notes) return null;
    const mapUrlMatch = notes.match(/mapUrl:(https?:\/\/[^\s\n]+)/);
    return mapUrlMatch ? mapUrlMatch[1] : null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-pink-500" />
        Event Details
      </h2>
      
      {/* Event Configuration Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Event Configuration</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleEventConfigChange('akad')}
            className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
              eventConfig === 'akad'
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Akad Nikah Only
          </button>
          <button
            type="button"
            onClick={() => handleEventConfigChange('resepsi')}
            className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
              eventConfig === 'resepsi'
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Resepsi Only
          </button>
          <button
            type="button"
            onClick={() => handleEventConfigChange('akad-resepsi')}
            className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
              eventConfig === 'akad-resepsi'
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Akad & Resepsi
          </button>
          <button
            type="button"
            onClick={() => handleEventConfigChange('pemberkatan')}
            className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
              eventConfig === 'pemberkatan'
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pemberkatan Only
          </button>
          <button
            type="button"
            onClick={() => handleEventConfigChange('pemberkatan-resepsi')}
            className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
              eventConfig === 'pemberkatan-resepsi'
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pemberkatan & Resepsi
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Ceremony - Show for akad, akad-resepsi, pemberkatan, pemberkatan-resepsi */}
        {(eventConfig === 'akad' || eventConfig === 'akad-resepsi' || eventConfig === 'pemberkatan' || eventConfig === 'pemberkatan-resepsi') && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">
              {eventConfig.includes('akad') ? 'Akad Nikah' : 'Pemberkatan'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={data?.ceremony?.time?.split(' - ')[0] || ''}
                  onChange={(e) => {
                    const startTime = e.target.value;
                    const endTime = data?.ceremony?.time?.split(' - ')[1] || '';
                    // If end time is enabled, preserve it; otherwise just use start time
                    const hasEndTime = data?.ceremony?.time?.includes(' - ');
                    const timeValue = hasEndTime && startTime ? `${startTime} - ${endTime}` : startTime;
                    handleEventChange('ceremony', 'time', timeValue);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="ceremony-use-end-time"
                  checked={!!data?.ceremony?.time?.includes(' - ')}
                  onChange={(e) => {
                    const startTime = data?.ceremony?.time?.split(' - ')[0] || '';
                    if (e.target.checked) {
                      // Enable end time
                      const endTime = data?.ceremony?.time?.split(' - ')[1] || '';
                      const timeValue = startTime ? `${startTime} - ${endTime}` : ' - ';
                      handleEventChange('ceremony', 'time', timeValue);
                    } else {
                      // Disable end time, keep only start time
                      handleEventChange('ceremony', 'time', startTime);
                    }
                  }}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="ceremony-use-end-time" className="ml-2 block text-sm text-gray-700">
                  Use End Time
                </label>
              </div>
              {data?.ceremony?.time?.includes(' - ') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={data?.ceremony?.time?.split(' - ')[1] || ''}
                    onChange={(e) => {
                      const startTime = data?.ceremony?.time?.split(' - ')[0] || '';
                      const endTime = e.target.value;
                      const timeValue = startTime ? `${startTime} - ${endTime}` : ` - ${endTime}`;
                      handleEventChange('ceremony', 'time', timeValue);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={data?.ceremony?.address || ''}
                  onChange={(e) => handleEventChange('ceremony', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Jl. Kebahagiaan No. 45, Jakarta Selatan"
                  rows={2}
                />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Or use a map link:</label>
                  <input
                    type="text"
                    value={data?.ceremony?.notes?.includes('mapUrl:') ? data.ceremony.notes.split('mapUrl:')[1].split('\n')[0] : ''}
                    onChange={(e) => {
                      // Store map URL in notes field with a prefix to identify it
                      const address = data?.ceremony?.address || '';
                      const mapUrl = e.target.value;
                      // Extract existing notes without the map URL
                      let existingNotes = data?.ceremony?.notes || '';
                      if (existingNotes.includes('mapUrl:')) {
                        const lines = existingNotes.split('\n');
                        const filteredLines = lines.filter(line => !line.startsWith('mapUrl:'));
                        existingNotes = filteredLines.join('\n');
                      }
                      const notes = mapUrl ? `${existingNotes}\nmapUrl:${mapUrl}`.trim() : existingNotes;
                      handleEventChange('ceremony', 'notes', notes);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => openMapPicker('ceremony')}
                    className="px-3 py-2 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    Pick Location
                  </button>
                  {(data?.ceremony?.notes?.includes('mapUrl:') || data?.ceremony?.coordinates) && (
                    <button
                      type="button"
                      onClick={() => {
                        // Clear map URL and preserve other notes
                        let existingNotes = data?.ceremony?.notes || '';
                        if (existingNotes.includes('mapUrl:')) {
                          const lines = existingNotes.split('\n');
                          const filteredLines = lines.filter(line => !line.startsWith('mapUrl:'));
                          existingNotes = filteredLines.join('\n').trim();
                        }
                        handleEventChange('ceremony', 'coordinates', null);
                        handleEventChange('ceremony', 'notes', existingNotes || '');
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Clear Location
                    </button>
                  )}
                  {/* Open Google Maps button */}
                  {getMapUrl(data?.ceremony?.notes) && (
                    <button
                      type="button"
                      onClick={() => {
                        const mapUrl = getMapUrl(data?.ceremony?.notes);
                        if (mapUrl) {
                          window.open(mapUrl, '_blank');
                        }
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Open in Google Maps
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reception - Show for resepsi, akad-resepsi, pemberkatan-resepsi */}
        {(eventConfig === 'resepsi' || eventConfig === 'akad-resepsi' || eventConfig === 'pemberkatan-resepsi') && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Resepsi Pernikahan</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={data?.reception?.time?.split(' - ')[0] || ''}
                  onChange={(e) => {
                    const startTime = e.target.value;
                    const endTime = data?.reception?.time?.split(' - ')[1] || '';
                    // If end time is enabled, preserve it; otherwise just use start time
                    const hasEndTime = data?.reception?.time?.includes(' - ');
                    const timeValue = hasEndTime && startTime ? `${startTime} - ${endTime}` : startTime;
                    handleEventChange('reception', 'time', timeValue);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="reception-use-end-time"
                  checked={!!data?.reception?.time?.includes(' - ')}
                  onChange={(e) => {
                    const startTime = data?.reception?.time?.split(' - ')[0] || '';
                    if (e.target.checked) {
                      // Enable end time
                      const endTime = data?.reception?.time?.split(' - ')[1] || '';
                      const timeValue = startTime ? `${startTime} - ${endTime}` : ' - ';
                      handleEventChange('reception', 'time', timeValue);
                    } else {
                      // Disable end time, keep only start time
                      handleEventChange('reception', 'time', startTime);
                    }
                  }}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="reception-use-end-time" className="ml-2 block text-sm text-gray-700">
                  Use End Time
                </label>
              </div>
              {data?.reception?.time?.includes(' - ') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={data?.reception?.time?.split(' - ')[1] || ''}
                    onChange={(e) => {
                      const startTime = data?.reception?.time?.split(' - ')[0] || '';
                      const endTime = e.target.value;
                      const timeValue = startTime ? `${startTime} - ${endTime}` : ` - ${endTime}`;
                      handleEventChange('reception', 'time', timeValue);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={data?.reception?.address || ''}
                  onChange={(e) => handleEventChange('reception', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Jl. Resepsi Indah No. 67, Jakarta Selatan"
                  rows={2}
                />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Or use a map link:</label>
                  <input
                    type="text"
                    value={data?.reception?.notes?.includes('mapUrl:') ? data.reception.notes.split('mapUrl:')[1].split('\n')[0] : ''}
                    onChange={(e) => {
                      // Store map URL in notes field with a prefix to identify it
                      const address = data?.reception?.address || '';
                      const mapUrl = e.target.value;
                      // Extract existing notes without the map URL
                      let existingNotes = data?.reception?.notes || '';
                      if (existingNotes.includes('mapUrl:')) {
                        const lines = existingNotes.split('\n');
                        const filteredLines = lines.filter(line => !line.startsWith('mapUrl:'));
                        existingNotes = filteredLines.join('\n');
                      }
                      const notes = mapUrl ? `${existingNotes}\nmapUrl:${mapUrl}`.trim() : existingNotes;
                      handleEventChange('reception', 'notes', notes);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => openMapPicker('reception')}
                    className="px-3 py-2 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    Pick Location
                  </button>
                  {(data?.reception?.notes?.includes('mapUrl:') || data?.reception?.coordinates) && (
                    <button
                      type="button"
                      onClick={() => {
                        // Clear map URL and preserve other notes
                        let existingNotes = data?.reception?.notes || '';
                        if (existingNotes.includes('mapUrl:')) {
                          const lines = existingNotes.split('\n');
                          const filteredLines = lines.filter(line => !line.startsWith('mapUrl:'));
                          existingNotes = filteredLines.join('\n').trim();
                        }
                        handleEventChange('reception', 'coordinates', null);
                        handleEventChange('reception', 'notes', existingNotes || '');
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Clear Location
                    </button>
                  )}
                  {/* Open Google Maps button */}
                  {getMapUrl(data?.reception?.notes) && (
                    <button
                      type="button"
                      onClick={() => {
                        const mapUrl = getMapUrl(data?.reception?.notes);
                        if (mapUrl) {
                          window.open(mapUrl, '_blank');
                        }
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Open in Google Maps
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Picker Modal */}
      <MapPickerModal
        isOpen={isMapPickerOpen}
        onClose={() => setIsMapPickerOpen(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={data?.[currentEventType]?.coordinates}
      />
    </div>
  );
};

export default EventDetailsForm;