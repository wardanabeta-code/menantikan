// Full-screen invitation view - exactly what recipients will see
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Heart, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTemplateById } from '../data/sampleTemplates';
import { generateSampleContent } from '../utils/sampleContent';
import type { Template, InvitationContent } from '../types';
import UnifiedPreview from '../components/UnifiedPreview';
import HeroSection from '../components/sections/HeroSection';

const InvitationViewPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [searchParams] = useSearchParams();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (templateId) {
      try {
        const foundTemplate = getTemplateById(templateId);
        setTemplate(foundTemplate || null);
      } catch (error) {
        console.error('Error fetching template:', error);
        setTemplate(null);
      }
    }

    // Get guest name from URL parameter
    const name = searchParams.get('to') || '';
    setGuestName(name);
  }, [templateId, searchParams]);

  // Handle audio play/pause
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Undangan Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">Undangan yang Anda cari tidak tersedia.</p>
        </div>
      </div>
    );
  }

  const sampleContent = generateSampleContent(template.templateId);

  // Single view with smooth transitions
  return (
    <div className="w-screen min-h-screen overflow-y-auto p-0 m-0 box-border">
      {/* Audio element for background music - using sample content for now */}
      <audio ref={audioRef} loop>
        <source src="" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Full Screen Invitation - Exactly what recipients see with Full Animations */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full min-h-screen box-border"
      >
        {/* Hero Section with Advanced Animations */}
        <div className="w-full min-h-screen relative box-border">
          {/* Floating particles background */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full opacity-30"
                style={{
                  backgroundColor: template.baseConfig?.colors?.accent || '#d4af37',
                  left: `${Math.min(10 + i * 15, 90)}%`, // Constrain to max 90%
                  top: `${20 + i * 10}%`
                }}
                animate={{
                  y: [-20, -80, -20],
                  x: [0, 20, 0], // Reduce movement
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </div>

          {/* Use the HeroSection component */}
          <HeroSection
            content={{
              coupleNames: sampleContent.brideGroomDetailsSection
                ? [sampleContent.brideGroomDetailsSection.bride.nickname, sampleContent.brideGroomDetailsSection.groom.nickname]
                : (sampleContent.heroSection?.coupleNames
                  ? sampleContent.heroSection.coupleNames
                  : ['Budi', 'Ani'])
            }}
            config={template.baseConfig}
            sectionConfig={{
              id: 'hero',
              type: 'hero',
              isVisible: true,
              order: 1,
              content: {},
              style: {}
            }}
            isPreview={false}
            eventDetails={sampleContent.eventDetails}
            // Pass the isOpened prop to control visibility of guest name
            isOpened={isOpened}
          />

          {/* Open Invitation Button - smoothly transitions out when opened */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ 
              opacity: isOpened ? 0 : 1,
              y: isOpened ? 20 : 0
            }}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut",
              opacity: { duration: 0.3 }
            }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10"
          >
            <button
              onClick={() => setIsOpened(true)}
              className="px-8 py-4 rounded-full text-white font-bold text-lg sm:text-xl shadow-lg transform transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: template.baseConfig?.colors?.primary || '#333',
                boxShadow: `0 4px 15px rgba(0, 0, 0, 0.2)`
              }}
            >
              Buka Undangan
            </button>
          </motion.div>
        </div>

        {/* Remaining sections - smoothly transition in when opened */}
        <AnimatePresence>
          {isOpened && template && (
            <motion.div
              // initial={{ opacity: 0, y: 50 }}
              // animate={{ opacity: 1, y: 0 }}
              // exit={{ opacity: 0, y: -50 }}
              // transition={{ 
              //   duration: 0.7, 
              //   ease: "easeInOut",
              //   y: { type: "spring", stiffness: 100 }
              // }}
              // className="w-full"
            >

              <UnifiedPreview
                template={template}
                skipHeroSection={true} // Skip the hero section since we've already shown it
              />

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating audio control button - positioned in bottom-right corner as requested */}
      <AnimatePresence>
        {isOpened && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleAudio}
            className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center md:w-12 md:h-12 bg-primary-600 hover:bg-primary-700 transition-all duration-200"
            style={{
              backgroundColor: template.baseConfig?.colors?.primary || '#333',
            }}
            data-testid="audio-control-button"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white md:w-5 md:h-5" />
            ) : (
              <Play className="w-6 h-6 text-white md:w-5 md:h-5" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvitationViewPage;