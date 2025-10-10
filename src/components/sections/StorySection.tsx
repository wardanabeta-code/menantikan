// Story section component for displaying couple's timeline
import React from 'react';
import { motion } from 'framer-motion';
import type { StoryContent, TemplateConfig, SectionConfig } from '../../types';

interface StorySectionProps {
  content: StoryContent;
  config: TemplateConfig;
  sectionConfig: SectionConfig;
  isPreview?: boolean;
}

const StorySection: React.FC<StorySectionProps> = ({
  content,
  config,
  sectionConfig,
  isPreview = false
}) => {
  console.log('StorySection rendering with:', { content, config, sectionConfig, isPreview });
  
  return (
    <section className="py-16 w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{
              color: config.colors?.text || 'var(--color-foreground)',
              fontFamily: config.typography?.headingFont || 'var(--font-heading)'
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Our Story
          </motion.h2>
          <motion.div 
            className="w-24 h-1 mx-auto rounded-full"
            style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line - only visible on desktop */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full hidden md:block"
            style={{ backgroundColor: config.colors?.border || 'var(--color-border)' }}
          />

          {content.timeline.map((item, index) => (
            <motion.div
              key={item.id}
              className={`relative flex items-start mb-16 flex-col`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Timeline dot - top center for both mobile and desktop */}
              <motion.div 
                className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full z-10 flex items-center justify-center"
                style={{ 
                  backgroundColor: config.colors?.accent || 'var(--color-accent)',
                  top: '0'
                }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              >
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </motion.div>

              {/* Content */}
              <div className={`w-full mt-16`}>
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300"
                  style={{
                    border: `1px solid ${config.colors?.border || 'var(--color-border)'}`
                  }}
                >
                  {/* Date */}
                  <motion.p 
                    className="text-sm mb-3 font-semibold"
                    style={{
                      color: config.colors?.accent || 'var(--color-accent)',
                      fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                  >
                    {item.date}
                  </motion.p>
                  
                  {/* Title */}
                  <motion.h3 
                    className="text-xl sm:text-2xl font-semibold mb-4"
                    style={{
                      color: config.colors?.text || 'var(--color-foreground)',
                      fontFamily: config.typography?.headingFont || 'var(--font-heading)'
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                  >
                    {item.title}
                  </motion.h3>
                  
                  {/* Image */}
                  {item.image && item.image.trim() !== '' && (
                    <motion.div 
                      className="mb-4 rounded-lg overflow-hidden"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg transition-transform duration-300"
                      />
                    </motion.div>
                  )}
                  
                  {/* Description */}
                  <motion.p 
                    className="text-base leading-relaxed"
                    style={{
                      color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                      fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
                  >
                    {item.description}
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StorySection;