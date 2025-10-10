import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { ClosingContent, TemplateConfig, SectionConfig, HeroContent } from '../../types';

interface ClosingSectionProps {
  content?: ClosingContent;
  config: TemplateConfig;
  sectionConfig: SectionConfig;
  isPreview?: boolean;
  heroContent?: HeroContent; // Add heroContent prop to access couple names
}

const ClosingSection: React.FC<ClosingSectionProps> = ({
  content,
  config,
  sectionConfig,
  isPreview = false,
  heroContent // Destructure heroContent
}) => {
  // Use content from sectionConfig if available, otherwise use passed content
  const closingContent = sectionConfig.content as ClosingContent || content;

  // Get couple names from heroContent or fallback to signatureNames or default
  const coupleNames = heroContent?.coupleNames || closingContent?.signatureNames || ['Mempelai Pria', 'Mempelai Wanita'];

  return (
    <section 
      className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-x-hidden max-w-full box-border"
      style={{
        backgroundColor: config.colors?.background || '#ffffff',
        backgroundImage: closingContent?.backgroundImage ? `url(${closingContent.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Background overlay if there's a background image */}
      {closingContent?.backgroundImage && (
        <div 
          className="absolute inset-0 bg-black opacity-30 max-w-full overflow-x-hidden box-border"
          style={{ backgroundColor: config.colors?.background + '80' || 'rgba(255,255,255,0.8)' }}
        />
      )}
      
      <div className="max-w-4xl mx-auto relative z-10 max-w-full overflow-x-hidden box-border w-full">
        {/* Section Title - Changed to "Terima Kasih" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              color: closingContent?.backgroundImage 
                ? '#ffffff' 
                : config.colors?.text || 'var(--color-foreground)',
              fontFamily: config.typography?.headingFont || 'var(--font-heading)'
            }}
          >
            Terima Kasih
          </h2>
          
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
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <p 
            className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
            style={{
              color: closingContent?.backgroundImage 
                ? '#ffffff' 
                : config.colors?.text || 'var(--color-foreground)',
              fontFamily: config.typography?.bodyFont || 'var(--font-body)'
            }}
          >
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.
          </p>
        </motion.div>

        {/* Gratitude Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
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
              Tanpa kehadiran dan doa restu dari keluarga serta sahabat sekalian, pernikahan kami bukanlah apa-apa. Terima kasih telah menjadi bagian dari hari bahagia kami.
            </p>
          </div>
        </motion.div>

        {/* Bride and Groom Names - Display couple names prominently */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mb-12"
        >
          <div className="space-y-4">
            {coupleNames.map((name, index) => (
              <div key={index}>
                <p 
                  className="text-4xl md:text-5xl font-bold"
                  style={{
                    color: closingContent?.backgroundImage 
                      ? '#ffffff' 
                      : config.colors?.primary || 'var(--color-primary)',
                    fontFamily: config.typography?.headingFont || 'var(--font-heading)'
                  }}
                >
                  {name}
                </p>
                {index < coupleNames.length - 1 && (
                  <p 
                    className="text-2xl my-6"
                    style={{
                      color: closingContent?.backgroundImage 
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
        </motion.div>

        {/* Final decorative element */}
        <div className="flex items-center justify-center space-x-2">
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
      </div>
    </section>
  );
};

export default ClosingSection;