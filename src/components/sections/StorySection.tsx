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
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
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

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-px h-full"
            style={{ backgroundColor: config.colors?.border || 'var(--color-border)' }}
          />

          {content.timeline.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div 
                className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full z-10"
                style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
              />

              {/* Content */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{
                      color: config.colors?.text || 'var(--color-foreground)',
                      fontFamily: config.typography?.headingFont || 'var(--font-heading)'
                    }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-sm mb-3"
                    style={{
                      color: config.colors?.accent || 'var(--color-accent)',
                      fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                    }}
                  >
                    {item.date}
                  </p>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{
                      color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                      fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StorySection;