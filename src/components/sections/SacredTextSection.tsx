// Sacred Text Section Component (Islamic and Non-Islamic)
import React from 'react';
import { motion } from 'framer-motion';
import type { SacredTextContent } from '../../types';

interface SacredTextSectionProps {
  content: SacredTextContent;
  templateConfig?: any;
}

const SacredTextSection: React.FC<SacredTextSectionProps> = ({ 
  content,
  templateConfig 
}) => {
  const colors = templateConfig?.colors || {
    primary: '#8b4513',
    secondary: '#d4af37',
    background: '#f9f7f4',
    text: '#2d1810',
    textSecondary: '#8b4513'
  };

  const typography = templateConfig?.typography || {
    headingFont: 'Playfair Display',
    bodyFont: 'Source Sans Pro'
  };

  return (
    <section 
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Bismillah for Islamic Texts */}
        {content.isIslamic && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="text-2xl md:text-3xl font-arabic mb-4"
              style={{ color: colors.primary }}
            >
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </div>
            <div 
              className="text-lg italic"
              style={{ color: colors.textSecondary }}
            >
              Bismillahirrahmanirrahim
            </div>
          </motion.div>
        )}

        {/* Section Title */}
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-12"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: content.isIslamic ? 0.2 : 0 }}
        >
          {content.title}
        </motion.h2>

        {/* Sacred Text */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: content.isIslamic ? 0.4 : 0.2 }}
        >
          <blockquote 
            className="text-xl md:text-2xl italic leading-relaxed px-4 py-8 rounded-xl"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              color: colors.text,
              fontFamily: typography.bodyFont,
              borderLeft: `4px solid ${colors.secondary}`
            }}
          >
            "{content.text}"
          </blockquote>
        </motion.div>

        {/* Source Information */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: content.isIslamic ? 0.6 : 0.4 }}
        >
          <div 
            className="text-lg font-semibold mb-2"
            style={{ color: colors.primary }}
          >
            {content.source}
          </div>
          {content.reference && (
            <div 
              className="text-base"
              style={{ color: colors.textSecondary }}
            >
              {content.reference}
            </div>
          )}
        </motion.div>

        {/* Decorative Elements */}
        <motion.div 
          className="flex justify-center mt-12"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: content.isIslamic ? 0.8 : 0.6 }}
        >
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-px"
              style={{ backgroundColor: colors.secondary }}
            />
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.secondary }}
            />
            <div 
              className="w-16 h-px"
              style={{ backgroundColor: colors.secondary }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SacredTextSection;