// Map section component for event location
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import type { EventDetails, TemplateConfig, SectionConfig } from '../../types';

interface MapSectionProps {
  content: EventDetails;
  config: TemplateConfig;
  sectionConfig: SectionConfig;
  isPreview?: boolean;
}

const MapSection: React.FC<MapSectionProps> = ({
  content,
  config,
  sectionConfig,
  isPreview = false
}) => {
  const getGoogleMapsUrl = (address: string, coordinates?: { lat: number; lng: number }) => {
    if (coordinates) {
      return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const getDirectionsUrl = (address: string, coordinates?: { lat: number; lng: number }) => {
    if (coordinates) {
      return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  // Get the main event (ceremony or reception)
  const mainEvent = content.ceremony || content.reception;
  if (!mainEvent) return null;

  const mapUrl = mainEvent.coordinates 
    ? `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${mainEvent.coordinates.lat},${mainEvent.coordinates.lng}&zoom=15`
    : `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(mainEvent.address)}&zoom=15`;

  return (
    <section className="py-16 px-4 w-full max-w-full overflow-x-hidden box-border">
      <div className="max-w-6xl mx-auto max-w-full overflow-x-hidden box-border">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              color: config.colors?.text || 'var(--color-foreground)',
              fontFamily: config.typography?.headingFont || 'var(--font-heading)'
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Location
          </motion.h2>
          <motion.div 
            className="w-24 h-px mx-auto"
            style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Location Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <motion.h3 
                className="text-2xl font-bold mb-4"
                style={{
                  color: config.colors?.text || 'var(--color-foreground)',
                  fontFamily: config.typography?.headingFont || 'var(--font-heading)'
                }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {mainEvent.name}
              </motion.h3>

              <div className="space-y-4">
                <motion.div 
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <MapPin 
                    className="w-5 h-5 mt-1 flex-shrink-0"
                    style={{ color: config.colors?.accent || 'var(--color-accent)' }}
                  />
                  <div>
                    <motion.p 
                      className="font-medium mb-1"
                      style={{
                        color: config.colors?.text || 'var(--color-foreground)',
                        fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      {mainEvent.venue}
                    </motion.p>
                    <motion.p 
                      className="text-sm"
                      style={{
                        color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                        fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      {mainEvent.address}
                    </motion.p>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3 pt-4"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Button
                    onClick={() => window.open(getGoogleMapsUrl(mainEvent.address, mainEvent.coordinates), '_blank')}
                    variant="outline"
                    className="flex-1"
                    style={{
                      borderColor: config.colors?.accent || 'var(--color-accent)',
                      color: config.colors?.accent || 'var(--color-accent)'
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Maps
                  </Button>

                  <Button
                    onClick={() => window.open(getDirectionsUrl(mainEvent.address, mainEvent.coordinates), '_blank')}
                    style={{
                      backgroundColor: config.colors?.accent || 'var(--color-accent)',
                      color: 'white'
                    }}
                    className="flex-1"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Additional Events */}
            {(content.ceremony && content.reception && content.ceremony !== mainEvent) && (
              <motion.div 
                className="bg-white rounded-lg shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <motion.h4 
                  className="text-lg font-semibold mb-3"
                  style={{
                    color: config.colors?.text || 'var(--color-foreground)',
                    fontFamily: config.typography?.headingFont || 'var(--font-heading)'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  Additional Location
                </motion.h4>
                <motion.div 
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <MapPin 
                    className="w-4 h-4 mt-1 flex-shrink-0"
                    style={{ color: config.colors?.accent || 'var(--color-accent)' }}
                  />
                  <div>
                    <motion.p 
                      className="font-medium"
                      style={{
                        color: config.colors?.text || 'var(--color-foreground)',
                        fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.9 }}
                    >
                      {content.ceremony.name} - {content.ceremony.venue}
                    </motion.p>
                    <motion.p 
                      className="text-sm"
                      style={{
                        color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                        fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 1.0 }}
                    >
                      {content.ceremony.address}
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Map Embed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {isPreview ? (
              // Placeholder map for preview
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin 
                    className="w-16 h-16 mx-auto mb-4"
                    style={{ color: config.colors?.textSecondary || 'var(--color-muted-foreground)' }}
                  />
                  <p 
                    className="text-lg font-medium"
                    style={{
                      color: config.colors?.text || 'var(--color-foreground)',
                      fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                    }}
                  >
                    Interactive Map
                  </p>
                  <p 
                    className="text-sm"
                    style={{
                      color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                      fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                    }}
                  >
                    Map will be displayed here
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                src={mapUrl}
                width="100%"
                height="384"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Event Location Map"
              />
            )}
          </motion.div>
        </div>

        {/* Parking and Transportation Info */}
        {mainEvent.notes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 bg-white rounded-lg shadow-lg p-6"
          >
            <motion.h4 
              className="text-lg font-semibold mb-3"
              style={{
                color: config.colors?.text || 'var(--color-foreground)',
                fontFamily: config.typography?.headingFont || 'var(--font-heading)'
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Additional Information
            </motion.h4>
            <motion.p 
              style={{
                color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                fontFamily: config.typography?.bodyFont || 'var(--font-body)'
              }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {mainEvent.notes}
            </motion.p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MapSection;