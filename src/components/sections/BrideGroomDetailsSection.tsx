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
    primary: 'var(--color-primary)',
    secondary: 'var(--color-accent)',
    background: 'var(--color-background)',
    text: 'var(--color-foreground)',
    textSecondary: 'var(--color-muted-foreground)'
  };

  const typography = templateConfig?.typography || {
    headingFont: 'var(--font-heading)',
    bodyFont: 'var(--font-body)'
  };

  return (
    <section
      className="py-12 w-full max-w-full box-border"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto w-full px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Bride Section */}
          <motion.div
            className="text-center max-w-full box-border"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative mb-6"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div 
                className="w-40 h-40 mx-auto rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg border-4"
                style={{ borderColor: colors.secondary }}
              >
                {/* Only render img tag if we have a valid profileImage URL */}
                {content.bride.profileImage && content.bride.profileImage.trim() !== '' ? (
                  <motion.img
                    src={content.bride.profileImage}
                    alt={content.bride.fullName}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  />
                ) : (
                  <motion.div
                    className="w-full h-full bg-gray-100 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <span className="text-5xl">👰</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.h3
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: colors.primary, fontFamily: typography.headingFont }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {content.bride.fullName}
            </motion.h3>

            <motion.p
              className="text-lg md:text-xl mb-4"
              style={{ color: colors.textSecondary, fontFamily: typography.bodyFont }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              ({content.bride.nickname})
            </motion.p>

            <motion.div
              className="space-y-2 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {content.bride.instagram && content.bride.instagram.trim() !== '' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <a
                    href={`https://instagram.com/${content.bride.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: colors.primary, fontFamily: typography.bodyFont }}
                  >
                    @{content.bride.instagram.replace('@', '')}
                  </a>
                </motion.div>
              )}
              <motion.p
                style={{ color: colors.text, fontFamily: typography.bodyFont }}
                className="text-lg"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <span className="font-semibold">Putri ke-{content.bride.childOrder}</span> dari pasangan
              </motion.p>
              <motion.p
                style={{ color: colors.text, fontFamily: typography.bodyFont }}
                className="text-lg"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                Bapak {content.bride.fatherName} & Ibu {content.bride.motherName}
              </motion.p>
            </motion.div>

            {content.bride.bio && content.bride.bio.trim() !== '' && (
              <motion.p
                className="text-base italic max-w-md mx-auto px-4 py-3 rounded-lg"
                style={{
                  color: colors.textSecondary,
                  backgroundColor: `${colors.secondary}20`,
                  fontStyle: 'italic'
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                "{content.bride.bio}"
              </motion.p>
            )}
          </motion.div>

          {/* Decorative Separator */}
          <motion.div
            className="hidden md:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: colors.secondary }}
            >
              <span className="text-white text-2xl">💕</span>
            </div>
          </motion.div>

          {/* Groom Section */}
          <motion.div
            className="text-center md:order-last"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative mb-6"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div 
                className="w-40 h-40 mx-auto rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg border-4"
                style={{ borderColor: colors.secondary }}
              >
                {/* Only render img tag if we have a valid profileImage URL */}
                {content.groom.profileImage && content.groom.profileImage.trim() !== '' ? (
                  <motion.img
                    src={content.groom.profileImage}
                    alt={content.groom.fullName}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  />
                ) : (
                  <motion.div
                    className="w-full h-full bg-gray-100 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <span className="text-5xl">🤵</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.h3
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: colors.primary, fontFamily: typography.headingFont }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {content.groom.fullName}
            </motion.h3>

            <motion.p
              className="text-lg md:text-xl mb-4"
              style={{ color: colors.textSecondary }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              ({content.groom.nickname})
            </motion.p>

            <motion.div
              className="space-y-2 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {content.groom.instagram && content.groom.instagram.trim() !== '' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <a
                    href={`https://instagram.com/${content.groom.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: colors.primary, fontFamily: typography.bodyFont }}
                  >
                    @{content.groom.instagram.replace('@', '')}
                  </a>
                </motion.div>
              )}
              <motion.p
                style={{ color: colors.text, fontFamily: typography.bodyFont }}
                className="text-lg"
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <span className="font-semibold">Putra ke-{content.groom.childOrder}</span> dari pasangan
              </motion.p>
              <motion.p
                style={{ color: colors.text, fontFamily: typography.bodyFont }}
                className="text-lg"
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                Bapak {content.groom.fatherName} & Ibu {content.groom.motherName}
              </motion.p>
            </motion.div>

            {content.groom.bio && content.groom.bio.trim() !== '' && (
              <motion.p
                className="text-base italic max-w-md mx-auto px-4 py-3 rounded-lg"
                style={{
                  color: colors.textSecondary,
                  backgroundColor: `${colors.secondary}20`,
                  fontStyle: 'italic'
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.8 }}
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