import React from 'react';
import { Clock } from 'lucide-react';
import type { CountdownContent } from '@/types';

interface CountdownSectionFormProps {
  data?: Partial<CountdownContent>;
  onChange: (field: string, value: any) => void;
}

const CountdownSectionForm: React.FC<CountdownSectionFormProps> = ({ data, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-pink-500" />
        Countdown
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={data?.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Hitung Mundur Acara"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Event</label>
          <select
            value={data?.targetEvent || 'ceremony'}
            onChange={(e) => onChange('targetEvent', e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="ceremony">Ceremony</option>
            <option value="reception">Reception</option>
            <option value="custom">Custom Date</option>
          </select>
        </div>
        {data?.targetEvent === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Date</label>
            <input
              type="date"
              value={data?.customDate ? new Date(data.customDate).toISOString().split('T')[0] : ''}
              onChange={(e) => onChange('customDate', new Date(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={data?.message || ''}
            onChange={(e) => onChange('message', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Kami menantikan kehadiran Anda di hari istimewa kami"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default CountdownSectionForm;