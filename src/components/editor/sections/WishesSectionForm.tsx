import React from 'react';
import { MessageCircle } from 'lucide-react';
import type { WishesContent } from '@/types';

interface WishesSectionFormProps {
  data?: Partial<WishesContent>;
  onChange: (field: string, value: any) => void;
}

const WishesSectionForm: React.FC<WishesSectionFormProps> = ({ data, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MessageCircle className="w-5 h-5 mr-2 text-pink-500" />
        Wishes Section
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={data?.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Ucapan & Doa"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={data?.subtitle || ''}
            onChange={(e) => onChange('subtitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Kirimi kami doa dan ucapan terbaik untuk hari istimewa kami"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={data?.message || ''}
            onChange={(e) => onChange('message', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Setiap ucapan dan doa dari Anda sangat berarti bagi kami..."
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entries Per Page</label>
          <input
            type="number"
            value={data?.entriesPerPage || 4}
            onChange={(e) => onChange('entriesPerPage', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="4"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data?.showForm || false}
              onChange={(e) => onChange('showForm', e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Show Form
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data?.showEntries || false}
              onChange={(e) => onChange('showEntries', e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Show Entries
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishesSectionForm;