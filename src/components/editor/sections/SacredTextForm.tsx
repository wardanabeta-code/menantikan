import React from 'react';
import { Book } from 'lucide-react';
import type { SacredTextContent } from '@/types';

interface SacredTextFormProps {
  data?: Partial<SacredTextContent>;
  onChange: (field: string, value: any) => void;
}

const SacredTextForm: React.FC<SacredTextFormProps> = ({ data, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Book className="w-5 h-5 mr-2 text-pink-500" />
        Sacred Text
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
          <textarea
            value={data?.text || ''}
            onChange={(e) => onChange('text', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="And di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..."
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <input
            type="text"
            value={data?.source || ''}
            onChange={(e) => onChange('source', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="QS. Ar-Rum: 21"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={data?.isIslamic || false}
            onChange={(e) => onChange('isIslamic', e.target.checked)}
            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Is Islamic Text
          </label>
        </div>
      </div>
    </div>
  );
};

export default SacredTextForm;