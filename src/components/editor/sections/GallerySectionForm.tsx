import React, { useState, useRef } from 'react';
import { Image, Plus, X, Upload } from 'lucide-react';
import type { GalleryContent, GalleryImage } from '@/types';

interface GallerySectionFormProps {
  data?: Partial<GalleryContent>;
  onChange: (field: string, value: any) => void;
  onImagesChange: (images: GalleryImage[]) => void;
}

const GallerySectionForm: React.FC<GallerySectionFormProps> = ({ data, onChange, onImagesChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // In a real implementation, this would upload to Cloudinary or Firebase Storage
      // For now, we'll create placeholder images
      const newImages: GalleryImage[] = Array.from(files).map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        caption: '',
        thumbnail: URL.createObjectURL(file)
      }));

      const updatedImages = [...(data?.images || []), ...newImages];
      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...(data?.images || [])];
    updatedImages.splice(index, 1);
    onImagesChange(updatedImages);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updatedImages = [...(data?.images || [])];
    if (updatedImages[index]) {
      updatedImages[index] = { ...updatedImages[index], caption };
      onImagesChange(updatedImages);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Image className="w-5 h-5 mr-2 text-pink-500" />
        Gallery
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={data?.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Perjalanan Kami Bersama"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
          <select
            value={data?.layout || 'grid'}
            onChange={(e) => onChange('layout', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="grid">Grid</option>
            <option value="masonry">Masonry</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>
        
        {/* Image Management */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-900">Images</h3>
            <button
              type="button"
              onClick={handleAddImage}
              disabled={uploading}
              className="px-3 py-1 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Image
            </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          
          {uploading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Uploading images...</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {data?.images?.map((image: GalleryImage, index: number) => (
              <div key={image.id} className="border border-gray-200 rounded-lg p-3 relative group">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden">
                  {/* Only render img tag if we have a valid URL */}
                  {image.url && image.url.trim() !== '' ? (
                    <img 
                      src={image.url} 
                      alt={image.caption || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={image.caption || ''}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Add caption..."
                />
              </div>
            ))}
            
            {(!data?.images || data.images.length === 0) && (
              <div className="col-span-full text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No images added yet</p>
                <p className="text-sm text-gray-400 mt-1">Click "Add Image" to upload photos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GallerySectionForm;