import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Quote } from 'lucide-react';
import type { ClosingContent, TemplateConfig, SectionConfig } from '../../types';

interface ClosingSectionProps {
  content?: ClosingContent;
  config: TemplateConfig;
  sectionConfig: SectionConfig;
  isPreview?: boolean;
}

const ClosingSection: React.FC<ClosingSectionProps> = ({
  content,
  config,
  sectionConfig,
  isPreview = false
}) => {
  // Use content from sectionConfig if available, otherwise use passed content
  const closingContent = sectionConfig.content as ClosingContent || content;

  if (!closingContent) {
    return null;
  }

  return (
    <section 
      className="py-16 px-4 relative overflow-hidden"
      style={{
        backgroundColor: config.colors?.background || '#ffffff',
        backgroundImage: closingContent.backgroundImage ? `url(${closingContent.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Background overlay if there's a background image */}
      {closingContent.backgroundImage && (
        <div 
          className="absolute inset-0 bg-black opacity-30"
          style={{ backgroundColor: config.colors?.background + '80' || 'rgba(255,255,255,0.8)' }}
        />
      )}
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Quote 
              className="w-8 h-8 mr-3"
              style={{ color: config.colors?.accent || 'var(--color-accent)' }}
            />
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{
                color: closingContent.backgroundImage 
                  ? '#ffffff' 
                  : config.colors?.text || 'var(--color-foreground)',
                fontFamily: config.typography?.headingFont || 'var(--font-heading)'
              }}
            >
              {closingContent.title || 'Penutup'}
            </h2>
            <Quote 
              className="w-8 h-8 ml-3 transform scale-x-[-1]"
              style={{ color: config.colors?.accent || 'var(--color-accent)' }}
            />
          </div>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center space-x-4">
            <div 
              className="w-16 h-px"
              style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
            />
            <Heart 
              className="w-4 h-4"
              style={{ color: config.colors?.accent || 'var(--color-accent)' }}
            />
            <div 
              className="w-16 h-px"
              style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
            />
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p 
            className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
            style={{
              color: closingContent.backgroundImage 
                ? '#ffffff' 
                : config.colors?.text || 'var(--color-foreground)',
              fontFamily: config.typography?.bodyFont || 'var(--font-body)'
            }}
          >
            {closingContent.message}
          </p>
        </motion.div>

        {/* Gratitude Message */}
        {closingContent.gratitudeMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div 
              className="bg-white bg-opacity-90 rounded-lg p-6 max-w-2xl mx-auto shadow-lg"
              style={{
                backgroundColor: config.colors?.background + 'f0' || 'rgba(255,255,255,0.9)',
                border: `1px solid ${config.colors?.border || '#e5e7eb'}`
              }}
            >
              <p 
                className="text-base md:text-lg italic leading-relaxed"
                style={{
                  color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                  fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                }}
              >
                {closingContent.gratitudeMessage}
              </p>
            </div>
          </motion.div>
        )}

        {/* Thank You Message */}
        {closingContent.includeThankYou && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Users 
                className="w-6 h-6 mr-2"
                style={{ color: config.colors?.accent || 'var(--color-accent)' }}
              />
              <h3 
                className="text-2xl md:text-3xl font-semibold"
                style={{
                  color: closingContent.backgroundImage 
                    ? '#ffffff' 
                    : config.colors?.primary || 'var(--color-primary)',
                  fontFamily: config.typography?.headingFont || 'var(--font-heading)'
                }}
              >
                Terima Kasih
              </h3>
              <Users 
                className="w-6 h-6 ml-2"
                style={{ color: config.colors?.accent || 'var(--color-accent)' }}
              />
            </div>
            <p 
              className="text-base md:text-lg"
              style={{
                color: closingContent.backgroundImage 
                  ? '#ffffff' 
                  : config.colors?.textSecondary || 'var(--color-muted-foreground)',
                fontFamily: config.typography?.bodyFont || 'var(--font-body)'
              }}
            >
              Atas kehadiran dan doa restu yang diberikan
            </p>
          </motion.div>
        )}

        {/* Signature Names */}
        {closingContent.signatureNames && closingContent.signatureNames.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="space-y-2">
              {closingContent.signatureNames.map((name, index) => (
                <div key={index}>
                  <p 
                    className="text-xl md:text-2xl font-semibold"
                    style={{
                      color: closingContent.backgroundImage 
                        ? '#ffffff' 
                        : config.colors?.primary || 'var(--color-primary)',
                      fontFamily: config.typography?.headingFont || 'var(--font-heading)'
                    }}
                  >
                    {name}
                  </p>
                  {index < closingContent.signatureNames!.length - 1 && (
                    <p 
                      className="text-lg"
                      style={{
                        color: closingContent.backgroundImage 
                          ? '#ffffff' 
                          : config.colors?.textSecondary || 'var(--color-muted-foreground)'
                      }}
                    >
                      &
                    </p>
                  )}
                </div>
              ))}
            </div>
            
            {/* Final decorative element */}
            <div className="mt-8 flex items-center justify-center space-x-2">
              <div 
                className="w-8 h-px"
                style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
              />
              <Heart 
                className="w-3 h-3"
                style={{ color: config.colors?.accent || 'var(--color-accent)' }}
              />
              <div 
                className="w-8 h-px"
                style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ClosingSection;