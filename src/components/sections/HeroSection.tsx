// Hero section component for invitations
import React from 'react';
import { motion } from 'framer-motion';
import type { HeroContent, TemplateConfig, SectionConfig } from '../../types';

interface HeroSectionProps {
  content: HeroContent;
  config: TemplateConfig;
  sectionConfig: SectionConfig;
  isPreview?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  content,
  config,
  sectionConfig,
  isPreview = false
}) => {
  const backgroundStyle = content.backgroundImage 
    ? { backgroundImage: `url(${content.backgroundImage})` }
    : {};

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        ...backgroundStyle,
        backgroundColor: config.colors?.background || 'var(--color-background)'
      }}
    >
      {/* Background overlay */}
      {content.backgroundImage && (
        <div className="absolute inset-0 bg-black/30" />
      )}
      
      {/* Background video */}
      {content.backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={content.backgroundVideo} type="video/mp4" />
        </video>
      )}
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {/* Couple names */}
        {content.coupleNames && content.coupleNames.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <p 
              className="text-lg font-medium tracking-wide uppercase"
              style={{ 
                color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                fontFamily: config.typography?.bodyFont || 'var(--font-body)'
              }}
            >
              {content.coupleNames.join(' & ')}
            </p>
          </motion.div>
        )}
        
        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          style={{
            color: config.colors?.text || 'var(--color-foreground)',
            fontFamily: config.typography?.headingFont || 'var(--font-heading)'
          }}
        >
          {content.title}
        </motion.h1>
        
        {/* Subtitle */}
        {content.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto"
            style={{
              color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
              fontFamily: config.typography?.bodyFont || 'var(--font-body)'
            }}
          >
            {content.subtitle}
          </motion.p>
        )}
        
        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center space-x-4"
        >
          <div 
            className="w-16 h-px"
            style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
          />
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
          />
          <div 
            className="w-16 h-px"
            style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
          />
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="animate-bounce">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: config.colors?.text || 'var(--color-foreground)' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;