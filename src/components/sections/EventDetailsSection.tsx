// Event details section component
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Shirt } from 'lucide-react';
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
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
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
            Event Details
          </h2>
          <div 
            className="w-24 h-px mx-auto"
            style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
          />
        </motion.div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={`${event.name}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div 
                className="h-2"
                style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
              />
              
              <div className="p-6">
                <h3 
                  className="text-2xl font-bold mb-6"
                  style={{
                    color: config.colors?.text || 'var(--color-foreground)',
                    fontFamily: config.typography?.headingFont || 'var(--font-heading)'
                  }}
                >
                  {event.name}
                </h3>

                <div className="space-y-4">
                  {/* Date */}
                  <div className="flex items-start space-x-3">
                    <Calendar 
                      className="w-5 h-5 mt-1 flex-shrink-0"
                      style={{ color: config.colors?.accent || 'var(--color-accent)' }}
                    />
                    <div>
                      <p 
                        className="font-medium"
                        style={{
                          color: config.colors?.text || 'var(--color-foreground)',
                          fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                        }}
                      >
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start space-x-3">
                    <Clock 
                      className="w-5 h-5 mt-1 flex-shrink-0"
                      style={{ color: config.colors?.accent || 'var(--color-accent)' }}
                    />
                    <div>
                      <p 
                        className="font-medium"
                        style={{
                          color: config.colors?.text || 'var(--color-foreground)',
                          fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                        }}
                      >
                        {event.time}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start space-x-3">
                    <MapPin 
                      className="w-5 h-5 mt-1 flex-shrink-0"
                      style={{ color: config.colors?.accent || 'var(--color-accent)' }}
                    />
                    <div>
                      <p 
                        className="font-medium mb-1"
                        style={{
                          color: config.colors?.text || 'var(--color-foreground)',
                          fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                        }}
                      >
                        {event.venue}
                      </p>
                      {getMapUrl(event.notes) ? (
                        <a 
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
                        </a>
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
                    </div>
                  </div>

                  {/* Dress Code */}
                  {event.dressCode && (
                    <div className="flex items-start space-x-3">
                      <Shirt 
                        className="w-5 h-5 mt-1 flex-shrink-0"
                        style={{ color: config.colors?.accent || 'var(--color-accent)' }}
                      />
                      <div>
                        <p 
                          className="text-sm font-medium"
                          style={{
                            color: config.colors?.text || 'var(--color-foreground)',
                            fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                          }}
                        >
                          Dress Code: {event.dressCode}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {event.notes && (
                    <div 
                      className="mt-4 p-3 rounded-lg"
                      style={{ backgroundColor: config.colors?.background || 'var(--color-muted)' }}
                    >
                      <p 
                        className="text-sm"
                        style={{
                          color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                          fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                        }}
                      >
                        {event.notes}
                      </p>
                    </div>
                  )}
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