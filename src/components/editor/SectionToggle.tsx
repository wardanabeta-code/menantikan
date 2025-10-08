import React from 'react';

interface SectionToggleProps {
  sectionName: string;
  isEnabled: boolean;
  onToggle: () => void;
  className?: string;
}

const SectionToggle: React.FC<SectionToggleProps> = ({ 
  sectionName, 
  isEnabled, 
  onToggle, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-sm font-medium text-gray-700">{sectionName}</span>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input 
          type="checkbox" 
          checked={isEnabled}
          onChange={onToggle}
          className="sr-only"
        />
        <div className={`block w-10 h-6 rounded-full ${isEnabled ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
      </div>
    </div>
  );
};

export default SectionToggle;