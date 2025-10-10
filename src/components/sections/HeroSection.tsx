// Hero section component for invitations
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HeroContent, TemplateConfig, SectionConfig, EventDetails } from '../../types';

interface HeroSectionProps {
  content: HeroContent;
  config: TemplateConfig;
  sectionConfig: SectionConfig;
  isPreview?: boolean;
  eventDetails?: EventDetails; // Added to access ceremony date for countdown
  isOpened?: boolean; // Added to control visibility of guest name after opening
}

const HeroSection: React.FC<HeroSectionProps> = ({
  content,
  config,
  sectionConfig,
  isPreview = false,
  eventDetails,
  isOpened = false // Default to false
}) => {
  console.log('HeroSection rendering with:', { content, config, sectionConfig, isPreview });
  
  // State for countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Get guest name from URL parameter
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    // In a real application, we would get this from URL params
    // For now, we'll simulate it
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get('to');
      if (name) {
        setGuestName(decodeURIComponent(name));
      }
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    // Check if eventDetails and ceremony exist
    if (!eventDetails || !eventDetails.ceremony) return;
    
    const ceremonyDate = eventDetails.ceremony.date;
    if (!ceremonyDate) return;

    const calculateTimeLeft = () => {
      // Handle both Date objects and date strings
      const eventDate = ceremonyDate instanceof Date 
        ? ceremonyDate 
        : new Date(ceremonyDate);
      
      const difference = eventDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Calculate initial time
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [eventDetails]);

  // Only set backgroundImage if content.backgroundImage is a non-empty string
  const backgroundStyle = content.backgroundImage && content.backgroundImage.trim() !== '' 
    ? { backgroundImage: `url(${content.backgroundImage})` }
    : {};

  // Extract colors from config with fallbacks
  const colors = {
    primary: config.colors?.primary || 'var(--color-primary)',
    secondary: config.colors?.secondary || 'var(--color-secondary)',
    accent: config.colors?.accent || 'var(--color-accent)',
    background: config.colors?.background || 'var(--color-background)',
    text: config.colors?.text || 'var(--color-foreground)',
    textSecondary: config.colors?.textSecondary || 'var(--color-muted-foreground)',
    border: config.colors?.border || 'var(--color-border)'
  };

  // Extract typography from config with fallbacks
  const typography = {
    fontFamily: config.typography?.fontFamily || 'var(--font-body)',
    headingFont: config.typography?.headingFont || 'var(--font-heading)',
    bodyFont: config.typography?.bodyFont || 'var(--font-body)'
  };

  return (
    <section 
      className="relative w-full flex items-center justify-center bg-cover bg-center bg-no-repeat px-0 sm:px-0 max-w-full box-border"
      style={{
        ...backgroundStyle,
        backgroundColor: colors.background,
        minHeight: isPreview ? '600px' : '100vh',
        width: '100%',
        height: '100%',
        maxHeight: '100vh',
        margin: 0,
        padding: '0',
        boxSizing: 'border-box'
      }}
    >
      {/* Background overlay - only show if we have a valid background image */}
      {content.backgroundImage && content.backgroundImage.trim() !== '' && (
        <div className="absolute inset-0 bg-black/30 max-w-full box-border" />
      )}
      
      {/* Background video - only render if we have a valid URL */}
      {content.backgroundVideo && content.backgroundVideo.trim() !== '' && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover max-w-full box-border"
        >
          <source src={content.backgroundVideo} type="video/mp4" />
        </video>
      )}
      
      {/* Content */}
      <div className="relative z-10 text-center mx-auto px-4 sm:px-6 w-full max-w-full box-border">
        {/* Main title - hardcoded default value - now even smaller */}
        <motion.h1
          className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 max-w-full box-border"
          style={{
            color: colors.text,
            fontFamily: typography.headingFont
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          The Wedding Of
        </motion.h1>
        
        {/* Couple names - now larger */}
        {content.coupleNames && content.coupleNames.length > 0 && (
          <motion.div
            className="mb-2 max-w-full  box-border"
            style={{ 
              color: colors.textSecondary,
              fontFamily: typography.bodyFont
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p 
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase max-w-full  box-border"
            >
              {content.coupleNames.join(' & ')}
            </p>
          </motion.div>
        )}
        
        {/* Event date - only shown if event details are available */}
        {eventDetails?.ceremony?.date && (
          <motion.div
            className="mb-6 max-w-full box-border"
            style={{ 
              color: colors.text,
              fontFamily: typography.bodyFont
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p 
              className="text-lg sm:text-xl font-medium max-w-full box-border"
            >
              {new Date(eventDetails.ceremony.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </motion.div>
        )}
        
        {/* Countdown timer - now below the event date */}
        {eventDetails?.ceremony?.date && (
          <motion.div 
            className="mb-8 max-w-full box-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div 
              className="flex justify-center flex-wrap gap-2 sm:gap-4"
            >
              {[
                { label: 'Hari', value: timeLeft.days },
                { label: 'Jam', value: timeLeft.hours },
                { label: 'Menit', value: timeLeft.minutes },
                { label: 'Detik', value: timeLeft.seconds }
              ].map((unit, index) => (
                <div 
                  key={unit.label}
                  className="text-center min-w-[50px] sm:min-w-[60px]"
                >
                  <motion.div 
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold mb-1 mx-auto"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: '#ffffff'
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.3,
                      delay: 0.4 + index * 0.1,
                      type: "spring",
                      stiffness: 300
                    }}
                  >
                    {unit.value.toString().padStart(2, '0')}
                  </motion.div>
                  <motion.div 
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: colors.text }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    {unit.label}
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Guest name and greeting - only shown if guest name is available and invitation is not opened */}
        <AnimatePresence>
          {guestName && !isOpened && (
            <motion.div 
              className="overflow-hidden max-w-full"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                height: { duration: 0.5, ease: "easeInOut" },
                opacity: { duration: 0.3 }
              }}
            >
              {/* Guest greeting */}
              <motion.div
                className="mb-2 max-w-full box-border"
                style={{ 
                  color: colors.textSecondary,
                  fontFamily: typography.bodyFont
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p 
                  className="text-base sm:text-lg font-medium tracking-wide max-w-full  box-border"
                >
                  Yth. Bpk/Ibu/Saudara/i
                </p>
              </motion.div>
              
              {/* Guest name */}
              <motion.div
                className="mb-6 max-w-full box-border"
                style={{ 
                  color: colors.text,
                  fontFamily: typography.headingFont
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <p 
                  className="text-xl sm:text-2xl md:text-3xl font-bold max-w-full box-border"
                >
                  {guestName}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Decorative elements */}
        <motion.div 
          className="flex items-center justify-center space-x-4 max-w-full box-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div 
            className="w-16 h-px max-w-full box-border"
            style={{ backgroundColor: colors.accent }}
          />
          <div 
            className="w-3 h-3 rounded-full max-w-full box-border"
            style={{ backgroundColor: colors.accent }}
          />
          <div 
            className="w-16 h-px max-w-full box-border"
            style={{ backgroundColor: colors.accent }}
          />
        </motion.div>
      </div>
      
      {/* Scroll indicator - only shown when invitation is opened */}
      <AnimatePresence>
        {isOpened && (
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 max-w-full box-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-bounce max-w-full box-border">
              <svg
                className="w-6 h-6 max-w-full box-border"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: colors.text }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;