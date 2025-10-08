// Gallery section component
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryContent, TemplateConfig, SectionConfig } from '../../types';

interface GallerySectionProps {
  content: GalleryContent;
  config: TemplateConfig;
  sectionConfig: SectionConfig;
  isPreview?: boolean;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  content,
  config,
  sectionConfig,
  isPreview = false
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const newIndex = direction === 'prev' 
      ? (selectedImage - 1 + content.images.length) % content.images.length
      : (selectedImage + 1) % content.images.length;
    
    setSelectedImage(newIndex);
  };

  const getGridClasses = () => {
    switch (content.layout) {
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 gap-4';
      case 'carousel':
        return 'flex overflow-x-auto space-x-4 pb-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    }
  };

  return (
    <>
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                color: config.colors?.text || 'var(--color-foreground)',
                fontFamily: config.typography?.headingFont || 'var(--font-heading)'
              }}
            >
              {content.title}
            </h2>
            <div 
              className="w-24 h-px mx-auto"
              style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
            />
          </motion.div>

          {/* Gallery Grid */}
          <div className={getGridClasses()}>
            {content.images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`cursor-pointer group ${
                  content.layout === 'carousel' ? 'flex-shrink-0 w-64' : ''
                } ${
                  content.layout === 'masonry' ? 'break-inside-avoid mb-4' : ''
                }`}
                onClick={() => openLightbox(index)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={image.thumbnail || image.url}
                    alt={image.caption || `Gallery image ${index + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Caption overlay */}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p 
                        className="text-white text-sm"
                        style={{ fontFamily: config.typography?.bodyFont || 'var(--font-body)' }}
                      >
                        {image.caption}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={content.images[selectedImage].url}
                alt={content.images[selectedImage].caption || `Gallery image ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Caption */}
              {content.images[selectedImage].caption && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg">
                  <p 
                    className="text-sm text-center"
                    style={{ fontFamily: config.typography?.bodyFont || 'var(--font-body)' }}
                  >
                    {content.images[selectedImage].caption}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedImage + 1} / {content.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GallerySection;