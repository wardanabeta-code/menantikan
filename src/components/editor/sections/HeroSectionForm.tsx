import React from 'react';
import { Heart } from 'lucide-react';
import type { HeroContent } from '@/types';

interface HeroSectionFormProps {
  data?: Partial<HeroContent>;
  onChange: (field: string, value: any) => void;
}

const HeroSectionForm: React.FC<HeroSectionFormProps> = ({ data, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Heart className="w-5 h-5 mr-2 text-pink-500" />
        Hero Section
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Couple Names</label>
          <input
            type="text"
            value={data?.coupleNames?.join(' & ') || ''}
            onChange={(e) => onChange('coupleNames', e.target.value.split(' & '))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Bride & Groom"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSectionForm;