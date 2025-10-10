// Countdown Section Component
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { EventInfo } from '../../types';

interface CountdownSectionProps {
  event: EventInfo;
  templateConfig?: any;
  title?: string;
}

const CountdownSection: React.FC<CountdownSectionProps> = ({ 
  event,
  templateConfig,
  title = 'Hitung Mundur Acara'
}) => {
  console.log('CountdownSection rendering with:', { event, templateConfig, title });
  
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

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Handle both Date objects and date strings
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
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
  }, [event.date]);

  const timeUnits = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds }
  ];

  return (
    <section 
      className="py-12 px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden box-border"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-3xl mx-auto max-w-full overflow-x-hidden box-border">
        <motion.div 
          className="bg-white bg-opacity-90 rounded-2xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Removed title section */}
          
          <div 
            className="flex justify-center flex-wrap gap-2 sm:gap-4"
          >
            {timeUnits.map((unit, index) => (
              <motion.div 
                key={unit.label}
                className="text-center min-w-[60px] sm:min-w-[80px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <motion.div 
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold mb-2 mx-auto"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#ffffff'
                  }}
                >
                  {unit.value.toString().padStart(2, '0')}
                </motion.div>
                <motion.div 
                  className="text-xs sm:text-sm font-medium"
                  style={{ color: colors.text, fontFamily: typography.bodyFont }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                >
                  {unit.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="text-lg font-semibold"
              style={{ color: colors.primary, fontFamily: typography.bodyFont }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              {event.name}
            </motion.div>
            <motion.div 
              className="text-base"
              style={{ color: colors.textSecondary, fontFamily: typography.bodyFont }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              {event.date instanceof Date 
                ? event.date.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : new Date(event.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
              }
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownSection;