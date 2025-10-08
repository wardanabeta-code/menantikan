// Bride and Groom Details Section Component
import React from 'react';
import { motion } from 'framer-motion';
import type { BrideGroomDetailsContent } from '../../types';

interface BrideGroomDetailsSectionProps {
  content: BrideGroomDetailsContent;
  templateConfig?: any;
}

const BrideGroomDetailsSection: React.FC<BrideGroomDetailsSectionProps> = ({ 
  content,
  templateConfig 
}) => {
  const colors = templateConfig?.colors || {
    primary: '#8b4513',
    secondary: '#d4af37',
    background: '#ffffff',
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
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {content.title}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Bride Section */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative mb-8">
              <div className="w-64 h-64 mx-auto rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {content.bride.profileImage ? (
                  <img 
                    src={content.bride.profileImage} 
                    alt={content.bride.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-8xl">👰</span>
                  </div>
                )}
              </div>
            </div>

            <motion.h3 
              className="text-2xl font-bold mb-2"
              style={{ color: colors.primary }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {content.bride.fullName}
            </motion.h3>

            <motion.p 
              className="text-lg mb-4"
              style={{ color: colors.textSecondary }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              ({content.bride.nickname})
            </motion.p>

            <motion.div 
              className="space-y-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {content.bride.instagram && (
                <p style={{ color: colors.text }}>
                  <a 
                    href={`https://instagram.com/${content.bride.instagram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: colors.primary }}
                  >
                    @{content.bride.instagram.replace('@', '')}
                  </a>
                </p>
              )}
              <p style={{ color: colors.text }}>
                <span className="font-semibold">Putri ke-{content.bride.childOrder}</span> dari pasangan
              </p>
              <p style={{ color: colors.text }}>
                Bapak {content.bride.fatherName} & Ibu {content.bride.motherName}
              </p>
            </motion.div>

            {content.bride.bio && (
              <motion.p 
                className="text-base italic max-w-md mx-auto"
                style={{ color: colors.textSecondary }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                "{content.bride.bio}"
              </motion.p>
            )}
          </motion.div>

          {/* Decorative Separator */}
          <div className="hidden md:flex items-center justify-center">
            <motion.div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.secondary }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="text-white text-2xl">💕</span>
            </motion.div>
          </div>

          {/* Groom Section */}
          <motion.div 
            className="text-center md:order-last"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative mb-8">
              <div className="w-64 h-64 mx-auto rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {content.groom.profileImage ? (
                  <img 
                    src={content.groom.profileImage} 
                    alt={content.groom.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-8xl">🤵</span>
                  </div>
                )}
              </div>
            </div>

            <motion.h3 
              className="text-2xl font-bold mb-2"
              style={{ color: colors.primary }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {content.groom.fullName}
            </motion.h3>

            <motion.p 
              className="text-lg mb-4"
              style={{ color: colors.textSecondary }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              ({content.groom.nickname})
            </motion.p>

            <motion.div 
              className="space-y-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {content.groom.instagram && (
                <p style={{ color: colors.text }}>
                  <a 
                    href={`https://instagram.com/${content.groom.instagram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: colors.primary }}
                  >
                    @{content.groom.instagram.replace('@', '')}
                  </a>
                </p>
              )}
              <p style={{ color: colors.text }}>
                <span className="font-semibold">Putra ke-{content.groom.childOrder}</span> dari pasangan
              </p>
              <p style={{ color: colors.text }}>
                Bapak {content.groom.fatherName} & Ibu {content.groom.motherName}
              </p>
            </motion.div>

            {content.groom.bio && (
              <motion.p 
                className="text-base italic max-w-md mx-auto"
                style={{ color: colors.textSecondary }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                "{content.groom.bio}"
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrideGroomDetailsSection;