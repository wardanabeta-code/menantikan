// Sacred Text Section Component (Islamic and Non-Islamic)
import React from 'react';
import { motion } from 'framer-motion';
import type { SacredTextContent, TemplateConfig } from '../../types';

interface SacredTextSectionProps {
  content: SacredTextContent;
  templateConfig?: TemplateConfig;
}

const SacredTextSection: React.FC<SacredTextSectionProps> = ({ 
  content,
  templateConfig 
}) => {
  // Extract colors from template config with fallbacks
  const colors = {
    primary: templateConfig?.colors?.primary || 'var(--color-primary)',
    secondary: templateConfig?.colors?.secondary || 'var(--color-secondary)',
    accent: templateConfig?.colors?.accent || 'var(--color-accent)',
    background: templateConfig?.colors?.background || 'var(--color-background)',
    text: templateConfig?.colors?.text || 'var(--color-foreground)',
    textSecondary: templateConfig?.colors?.textSecondary || 'var(--color-muted-foreground)'
  };

  // Extract typography from template config with fallbacks
  const typography = {
    headingFont: templateConfig?.typography?.headingFont || 'var(--font-heading)',
    bodyFont: templateConfig?.typography?.bodyFont || 'var(--font-body)'
  };

  return (
    <section 
      className="py-12 px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden box-border"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto text-center w-full max-w-full overflow-x-hidden box-border">
        {/* Bismillah for Islamic Texts */}
        {content.isIslamic && (
          <motion.div 
            className="mb-6 max-w-full overflow-x-hidden box-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div 
              className="text-2xl md:text-3xl font-arabic mb-2 max-w-full overflow-x-hidden box-border"
              style={{ color: colors.primary }}
            >
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </div>
            <div 
              className="text-base md:text-lg italic max-w-full overflow-x-hidden box-border"
              style={{ color: colors.textSecondary, fontFamily: typography.bodyFont }}
            >
              Bismillahirrahmanirrahim
            </div>
          </motion.div>
        )}

        {/* Sacred Text */}
        <motion.div 
          className="mb-8 max-w-full overflow-x-hidden box-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: content.isIslamic ? 0.2 : 0 }}
        >
          <blockquote 
            className="text-lg md:text-xl italic leading-relaxed px-4 py-6 rounded-lg max-w-full overflow-x-hidden box-border"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: colors.text,
              fontFamily: typography.bodyFont,
              borderLeft: `3px solid ${colors.accent}`
            }}
          >
            "{content.text}"
          </blockquote>
        </motion.div>

        {/* Source Information */}
        <motion.div 
          className="text-center max-w-full overflow-x-hidden box-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: content.isIslamic ? 0.3 : 0.1 }}
        >
          <div 
            className="text-lg font-semibold mb-1 max-w-full overflow-x-hidden box-border"
            style={{ color: colors.primary }}
          >
            {content.source}
          </div>
          {content.reference && (
            <div 
              className="text-base max-w-full overflow-x-hidden box-border"
              style={{ color: colors.textSecondary, fontFamily: typography.bodyFont }}
            >
              {content.reference}
            </div>
          )}
        </motion.div>

        {/* Decorative Elements */}
        <motion.div 
          className="flex justify-center mt-8 max-w-full overflow-x-hidden box-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: content.isIslamic ? 0.4 : 0.2 }}
        >
          <div className="flex items-center space-x-3 max-w-full overflow-x-hidden box-border">
            <div 
              className="w-12 h-px max-w-full overflow-x-hidden box-border"
              style={{ backgroundColor: colors.accent }}
            />
            <div 
              className="w-2 h-2 rounded-full max-w-full overflow-x-hidden box-border"
              style={{ backgroundColor: colors.accent }}
            />
            <div 
              className="w-12 h-px max-w-full overflow-x-hidden box-border"
              style={{ backgroundColor: colors.accent }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SacredTextSection;