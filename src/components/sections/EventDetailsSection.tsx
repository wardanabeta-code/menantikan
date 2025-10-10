// Event details section component
import React from 'react';
import { motion } from 'framer-motion';
import type { EventDetails, TemplateConfig, SectionConfig } from '../../types';

interface EventDetailsSectionProps {
  content: EventDetails;
  config: TemplateConfig;
  sectionConfig: SectionConfig;
  isPreview?: boolean;
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  content,
  config,
  sectionConfig,
  isPreview = false
}) => {
  console.log('EventDetailsSection rendering with:', { content, config, sectionConfig, isPreview });
  
  const formatDate = (date: Date | string) => {
    // If it's already a string, return it as is
    if (typeof date === 'string') {
      // Try to parse it as a date and format it properly
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(parsedDate);
      }
      return date; // Return as is if it can't be parsed
    }
    
    // If it's a Date object, format it normally
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Extract Google Maps URL from notes
  const getMapUrl = (notes: string | undefined) => {
    if (!notes) return null;
    const mapUrlMatch = notes.match(/mapUrl:(https?:\/\/[^\s\n]+)/);
    return mapUrlMatch ? mapUrlMatch[1] : null;
  };

  const events = [
    ...(content.ceremony ? [{ ...content.ceremony, type: 'Ceremony' }] : []),
    ...(content.reception ? [{ ...content.reception, type: 'Reception' }] : []),
    ...(content.additionalEvents || [])
  ];

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
            Event Details
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

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={`${event.name}-${index}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden border"
              style={{ 
                borderColor: config.colors?.border || 'var(--color-border)',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div 
                className="h-2"
                style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
              />
              
              <div className="p-6 sm:p-8">
                <motion.h3 
                  className="text-2xl sm:text-3xl font-bold mb-6"
                  style={{
                    color: config.colors?.text || 'var(--color-foreground)',
                    fontFamily: config.typography?.headingFont || 'var(--font-heading)'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                >
                  {event.name}
                </motion.h3>

                <div className="space-y-5">
                  {/* Date */}
                  <motion.div 
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${config.colors?.accent || 'var(--color-accent)'}20` }}
                    >
                      <span 
                        className="text-xl"
                        style={{ color: config.colors?.accent || 'var(--color-accent)' }}
                      >
                        📅
                      </span>
                    </div>
                    <div>
                      <p 
                        className="font-medium text-base sm:text-lg"
                        style={{
                          color: config.colors?.text || 'var(--color-foreground)',
                          fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                        }}
                      >
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </motion.div>

                  {/* Time */}
                  <motion.div 
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${config.colors?.accent || 'var(--color-accent)'}20` }}
                    >
                      <span 
                        className="text-xl"
                        style={{ color: config.colors?.accent || 'var(--color-accent)' }}
                      >
                        🕒
                      </span>
                    </div>
                    <div>
                      <p 
                        className="font-medium text-base sm:text-lg"
                        style={{
                          color: config.colors?.text || 'var(--color-foreground)',
                          fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                        }}
                      >
                        {event.time}
                      </p>
                    </div>
                  </motion.div>

                  {/* Location */}
                  <motion.div 
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.6 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${config.colors?.accent || 'var(--color-accent)'}20` }}
                    >
                      <span 
                        className="text-xl"
                        style={{ color: config.colors?.accent || 'var(--color-accent)' }}
                      >
                        📍
                      </span>
                    </div>
                    <div>
                      <p 
                        className="font-medium mb-1 text-base sm:text-lg"
                        style={{
                          color: config.colors?.text || 'var(--color-foreground)',
                          fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                        }}
                      >
                        {event.venue}
                      </p>
                      {getMapUrl(event.notes) ? (
                        <motion.a 
                          href={getMapUrl(event.notes) || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm underline hover:text-blue-600"
                          style={{
                            color: config.colors?.accent || 'var(--color-accent)',
                            fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                          }}
                        >
                          {event.address}
                        </motion.a>
                      ) : (
                        <p 
                          className="text-sm"
                          style={{
                            color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                            fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                          }}
                        >
                          {event.address}
                        </p>
                      )}
                      {event.notes && !getMapUrl(event.notes) && (
                        <motion.p 
                          className="text-sm mt-2 italic"
                          style={{
                            color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                            fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                          }}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 0.7 }}
                        >
                          {event.notes}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsSection;