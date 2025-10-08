import React from 'react';
import { BookOpen, Plus, X } from 'lucide-react';
import type { StoryContent, TimelineItem } from '@/types';

interface StorySectionFormProps {
  data?: Partial<StoryContent>;
  onChange: (field: string, value: any) => void;
  onTimelineChange: (index: number, field: string, value: any) => void;
  onAddTimelineItem: () => void;
  onRemoveTimelineItem: (index: number) => void;
}

const StorySectionForm: React.FC<StorySectionFormProps> = ({ 
  data, 
  onChange, 
  onTimelineChange,
  onAddTimelineItem,
  onRemoveTimelineItem
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BookOpen className="w-5 h-5 mr-2 text-pink-500" />
        Story Section
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={data?.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Kisah Cinta Kami"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-900">Timeline</h3>
            <button
              type="button"
              onClick={onAddTimelineItem}
              className="px-3 py-1 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </button>
          </div>
          {data?.timeline && data.timeline.length > 0 ? (
            data.timeline.map((item: TimelineItem, index: number) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 mb-4 relative group">
                <button
                  type="button"
                  onClick={() => onRemoveTimelineItem(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <h4 className="font-medium text-gray-900 mb-2">Story Item {index + 1}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={item.date || ''}
                      onChange={(e) => onTimelineChange(index, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Musim Semi 2019"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => onTimelineChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Pertemuan Pertama"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => onTimelineChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Kami bertemu di sebuah kedai kopi dekat kampus..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No timeline items added yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Item" to create your story</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorySectionForm;