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

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = event.date.getTime() - new Date().getTime();
      
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
      className="py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="bg-white bg-opacity-90 rounded-2xl p-6 sm:p-8"
          style={{ 
            // Removed border styling
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Removed title section */}
          
          <motion.div 
            className="flex justify-center flex-wrap gap-2 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {timeUnits.map((unit, index) => (
              <motion.div 
                key={unit.label}
                className="text-center min-w-[60px] sm:min-w-[80px]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <div 
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold mb-2 mx-auto"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#ffffff'
                  }}
                >
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <div 
                  className="text-xs sm:text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  {unit.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div 
              className="text-lg font-semibold"
              style={{ color: colors.primary }}
            >
              {event.name}
            </div>
            <div 
              className="text-base"
              style={{ color: colors.textSecondary }}
            >
              {event.date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownSection;