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
  console.log('GallerySection rendering with:', { content, config, sectionConfig, isPreview });
  
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
        return 'columns-2 sm:columns-2 lg:columns-3 gap-4';
      case 'carousel':
        return 'flex overflow-x-auto space-x-4 pb-4';
      default:
        return 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4';
    }
  };

  return (
    <>
      <section className="py-16 px-4 sm:px-6 lg:px-8 w-full max-w-full box-border">
        <div className="mx-auto max-w-full box-border">
          {/* Section Title */}
          <motion.div
            className="text-center mb-12 max-w-full box-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 max-w-full box-border"
              style={{
                color: config.colors?.text || 'var(--color-foreground)',
                fontFamily: config.typography?.headingFont || 'var(--font-heading)'
              }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {content.title && content.title.trim() !== '' ? content.title : 'Gallery'}
            </motion.h2>
            <motion.div 
              className="w-24 h-px mx-auto max-w-full box-border"
              style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </motion.div>

          {/* Gallery Grid */}
          <div className={`${getGridClasses()} max-w-full box-border`}>
            {content.images.map((image, index) => (
              <motion.div
                key={image.id}
                className={`cursor-pointer group ${
                  content.layout === 'carousel' ? 'flex-shrink-0 w-64 sm:w-80' : ''
                } ${
                  content.layout === 'masonry' ? 'break-inside-avoid mb-4' : ''
                } max-w-full  box-border`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => openLightbox(index)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg max-w-full  box-border">
                  {/* Only render img tag if we have a valid URL */}
                  {image.thumbnail || (image.url && image.url.trim() !== '') ? (
                    <motion.img
                      src={image.thumbnail || image.url}
                      alt={image.caption || `Gallery image ${index + 1}`}
                      className="w-full h-auto object-cover transition-transform duration-300 max-w-full  box-border"
                    />
                  ) : (
                    // Fallback placeholder if no image URL
                    <motion.div 
                      className="w-full h-48 bg-gray-200 flex items-center justify-center max-w-full  box-border"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="text-gray-500">No image</div>
                    </motion.div>
                  )}
                  
                  {/* Overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 max-w-full  box-border"
                  />
                  
                  {/* Caption overlay */}
                  {image.caption && image.caption.trim() !== '' && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-full  box-border"
                    >
                      <p 
                        className="text-white text-sm max-w-full  box-border"
                        style={{ fontFamily: config.typography?.bodyFont || 'var(--font-body)' }}
                      >
                        {image.caption}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && content.images[selectedImage] && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 max-w-full  box-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLightbox}
          >
            {/* Close button */}
            <motion.button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 max-w-full  box-border"
            >
              <X className="w-8 h-8 max-w-full  box-border" />
            </motion.button>

            {/* Navigation buttons */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 hidden sm:block max-w-full  box-border"
            >
              <ChevronLeft className="w-8 h-8 max-w-full  box-border" />
            </motion.button>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 hidden sm:block max-w-full  box-border"
            >
              <ChevronRight className="w-8 h-8 max-w-full  box-border" />
            </motion.button>

            {/* Image - only render if we have a valid URL */}
            {content.images[selectedImage].url && content.images[selectedImage].url.trim() !== '' && (
              <motion.div
                className="max-h-full max-w-full  box-border"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={content.images[selectedImage].url}
                  alt={content.images[selectedImage].caption || `Gallery image ${selectedImage + 1}`}
                  className=" max-h-full object-contain max-w-full  box-border"
                />
                
                {/* Caption */}
                {content.images[selectedImage].caption && content.images[selectedImage].caption.trim() !== '' && (
                  <motion.div 
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg max-w-full box-border"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <p 
                      className="text-sm text-center max-w-full box-border"
                      style={{ fontFamily: config.typography?.bodyFont || 'var(--font-body)' }}
                    >
                      {content.images[selectedImage].caption}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Image counter */}
            <motion.div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm max-w-full box-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {selectedImage + 1} / {content.images.length}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GallerySection;