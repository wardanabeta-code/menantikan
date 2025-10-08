import React from 'react';
import { Heart } from 'lucide-react';
import type { ClosingContent } from '@/types';

interface ClosingSectionFormProps {
  data?: Partial<ClosingContent>;
  onChange: (field: string, value: any) => void;
}

const ClosingSectionForm: React.FC<ClosingSectionFormProps> = ({ data, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Heart className="w-5 h-5 mr-2 text-pink-500" />
        Closing Message
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={data?.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Penutup"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={data?.message || ''}
            onChange={(e) => onChange('message', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Merupakan suatu kehormatan dan kebahagiaan bagi kami..."
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gratitude Message</label>
          <textarea
            value={data?.gratitudeMessage || ''}
            onChange={(e) => onChange('gratitudeMessage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Tanpa kehadiran dan doa restu dari keluarga serta sahabat..."
            rows={2}
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={data?.includeThankYou || false}
            onChange={(e) => onChange('includeThankYou', e.target.checked)}
            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Include Thank You Message
          </label>
        </div>
      </div>
    </div>
  );
};

export default ClosingSectionForm;