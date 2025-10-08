// Full-screen invitation view - exactly what recipients will see
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Heart, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTemplateById } from '../data/sampleTemplates';
import { generateSampleContent } from '../utils/sampleContent';
import type { Template } from '../types';

// Import new section components
import BrideGroomDetailsSection from '../components/sections/BrideGroomDetailsSection';
import SacredTextSection from '../components/sections/SacredTextSection';
import CountdownSection from '../components/sections/CountdownSection';
import WishesSection from '../components/sections/WishesSection';
import GiftSection from '../components/sections/GiftSection';

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
      const foundTemplate = getTemplateById(templateId);
      setTemplate(foundTemplate || null);
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

  // Removed viewport logging useEffect

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
  const templateConfig = template.baseConfig;

  // Single view with smooth transitions
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Audio element for background music - using sample content for now */}
      <audio ref={audioRef} loop>
        <source src="" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {/* Full Screen Invitation - Exactly what recipients see with Full Animations */}
      <div className="invitation-container w-full max-w-full">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="recipient-view" 
          style={{ 
            backgroundColor: templateConfig?.colors?.background || '#ffffff',
            color: templateConfig?.colors?.text || '#000000',
            fontFamily: templateConfig?.typography?.bodyFont || 'Inter'
          }}
        >
          {/* Hero Section with Advanced Animations */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center py-20 px-4 sm:px-6 lg:px-8 relative"
            style={{ 
              backgroundColor: templateConfig?.colors?.background || '#ffffff',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Floating particles background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full opacity-30"
                  style={{ 
                    backgroundColor: templateConfig?.colors?.accent || '#d4af37',
                    left: `${10 + i * 15}%`,
                    top: `${20 + i * 10}%`
                  }}
                  animate={{
                    y: [-20, -80, -20],
                    x: [0, 30, 0],
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

            {/* "The Wedding Of" text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl font-medium mb-6"
              style={{ color: templateConfig?.colors?.primary || '#333' }}
            >
              The Wedding Of
            </motion.div>

            {/* Couple Nicknames - Most Prominent */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 relative z-10"
              style={{ 
                color: templateConfig?.colors?.primary || '#333',
                fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
              }}
            >
              {sampleContent.brideGroomDetailsSection 
                ? `${sampleContent.brideGroomDetailsSection.bride.nickname} & ${sampleContent.brideGroomDetailsSection.groom.nickname}`
                : (sampleContent.heroSection?.coupleNames 
                    ? sampleContent.heroSection.coupleNames.join(' & ')
                    : 'Budi & Ani')}
            </motion.div>
            
            {/* Countdown Section */}
            {sampleContent.countdownSection && sampleContent.eventDetails?.ceremony && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-8"
              >
                <CountdownSection 
                  event={sampleContent.eventDetails.ceremony}
                  templateConfig={templateConfig}
                  title={sampleContent.countdownSection.title}
                />
              </motion.div>
            )}
            
            {/* Greeting with guest name - smoothly transitions out when opened */}
            <AnimatePresence>
              {!isOpened && guestName && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="mt-12 text-center"
                >
                  <div 
                    className="text-lg sm:text-xl md:text-2xl font-medium mb-2"
                    style={{ color: templateConfig?.colors?.textSecondary || '#666' }}
                  >
                    Kepada Yth.
                  </div>
                  <div 
                    className="text-xl sm:text-2xl md:text-3xl font-bold"
                    style={{ color: templateConfig?.colors?.primary || '#333' }}
                  >
                    Bapak/Ibu/Saudara/i
                  </div>
                  <div 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2"
                    style={{ color: templateConfig?.colors?.primary || '#333' }}
                  >
                    {decodeURIComponent(guestName)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Open Invitation Button - smoothly transitions out when opened */}
            {/* Using flex layout with smooth height transition to allow other elements to center smoothly */}
            <motion.div
              initial={{ height: 'auto', opacity: 1 }}
              animate={{ height: isOpened ? 0 : 'auto', opacity: isOpened ? 0 : 1 }}
              transition={{ duration: 0.5, delay: isOpened ? 0 : 1.1 }}
              className="overflow-hidden"
            >
              <div className="mt-16 flex items-center justify-center">
                <button
                  onClick={() => setIsOpened(true)}
                  className="px-8 py-4 rounded-full text-white font-bold text-lg sm:text-xl shadow-lg transform transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: templateConfig?.colors?.primary || '#333',
                    boxShadow: `0 4px 15px rgba(0, 0, 0, 0.2)`
                  }}
                >
                  Buka Undangan
                </button>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Remaining sections - smoothly transition in when opened */}
          <AnimatePresence>
            {isOpened && (
              <>
                {/* Sacred Text Section - Moved to right after Hero Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {sampleContent.sacredTextSection && (
                    <SacredTextSection 
                      content={sampleContent.sacredTextSection} 
                      templateConfig={templateConfig}
                    />
                  )}
                </motion.div>
                
                {/* Bride and Groom Details Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {sampleContent.brideGroomDetailsSection && (
                    <BrideGroomDetailsSection 
                      content={sampleContent.brideGroomDetailsSection} 
                      templateConfig={templateConfig}
                    />
                  )}
                </motion.div>
                
                {/* Story Section with Advanced Animations */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {sampleContent.storySection && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="py-16 px-4 sm:px-6 lg:px-8"
                      style={{ backgroundColor: '#f9f7f4' }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <motion.h2 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4
                        }}
                        className="text-3xl md:text-4xl font-bold text-center mb-16"
                        style={{ 
                          color: templateConfig?.colors?.primary || '#333',
                          fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
                        }}
                        viewport={{ once: true }}
                      >
                        {sampleContent.storySection.title}
                      </motion.h2>
                      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {sampleContent.storySection.timeline?.map((item, index) => (
                          <motion.div 
                            key={item.id} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.4,
                              delay: index * 0.1
                            }}
                            whileHover={{ 
                              y: -8,
                              transition: { duration: 0.2 }
                            }}
                            className="text-center p-6 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
                            viewport={{ once: true, margin: "-50px" }}
                          >
                            <motion.div 
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ 
                                duration: 0.3,
                                delay: 0.1
                              }}
                              className="text-sm font-bold mb-3"
                              style={{ color: templateConfig?.colors?.accent || '#d4af37' }}
                              viewport={{ once: true }}
                            >
                              {item.date}
                            </motion.div>
                            <motion.h3 
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.3,
                                delay: 0.15
                              }}
                              className="text-xl font-bold mb-4"
                              viewport={{ once: true }}
                            >
                              {item.title}
                            </motion.h3>
                            <motion.p 
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.3,
                                delay: 0.2
                              }}
                              className="text-base leading-relaxed" 
                              style={{ color: templateConfig?.colors?.textSecondary || '#666' }}
                              viewport={{ once: true }}
                            >
                              {item.description}
                            </motion.p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Event Details Section with Animations */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-16 px-4 sm:px-6 lg:px-8"
                    style={{ 
                      backgroundColor: templateConfig?.colors?.background || '#ffffff',
                      fontFamily: templateConfig?.typography?.bodyFont || 'Inter'
                    }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <motion.h2 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.4
                      }}
                      className="text-3xl md:text-4xl font-bold mb-12"
                      style={{ 
                        color: templateConfig?.colors?.primary || '#333',
                        fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
                      }}
                      viewport={{ once: true }}
                    >
                      Detail Acara
                    </motion.h2>
                    
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                      {/* Akad/Pemberkatan Section */}
                      {sampleContent.eventDetails?.ceremony && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.4
                          }}
                          whileHover={{ 
                            y: -8,
                            transition: { duration: 0.3 }
                          }}
                          className="rounded-2xl p-8 relative overflow-hidden"
                          style={{ 
                            backgroundColor: templateConfig?.colors?.background || '#ffffff',
                            boxShadow: `0 10px 25px rgba(0, 0, 0, 0.08), 0 5px 10px rgba(0, 0, 0, 0.04)`,
                            border: `1px solid ${templateConfig?.colors?.accent + '20' || '#f0f0f0'}`
                          }}
                          viewport={{ once: true, margin: "-50px" }}
                        >
                          {/* Decorative corner elements */}
                          <div 
                            className="absolute top-0 left-0 w-24 h-24 rounded-br-full opacity-10"
                            style={{ 
                              backgroundColor: templateConfig?.colors?.primary || '#333'
                            }}
                          />
                          <div 
                            className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full opacity-10"
                            style={{ 
                              backgroundColor: templateConfig?.colors?.primary || '#333'
                            }}
                          />
                          
                          <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.3
                            }}
                            className="text-2xl font-bold mb-8 text-center relative z-10"
                            style={{ 
                              color: templateConfig?.colors?.primary || '#333',
                              fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
                            }}
                            viewport={{ once: true }}
                          >
                            {sampleContent.eventDetails.ceremony.name}
                          </motion.h3>
                          
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.3
                            }}
                            className="space-y-6 text-center relative z-10"
                            style={{ 
                              color: templateConfig?.colors?.text || '#000000',
                              fontFamily: templateConfig?.typography?.bodyFont || 'Inter'
                            }}
                            viewport={{ once: true }}
                          >
                            <div className="pb-6 border-b border-gray-100">
                              <div className="text-lg font-medium mb-3">
                                {sampleContent.eventDetails.ceremony.date.toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                            
                            <div className="pb-6 border-b border-gray-100">
                              <div className="text-lg font-medium">{sampleContent.eventDetails.ceremony.time}</div>
                            </div>
                            
                            <div>
                              <div 
                                className="text-xl font-bold mb-2"
                                style={{ color: templateConfig?.colors?.primary || '#333' }}
                              >
                                {sampleContent.eventDetails.ceremony.venue}
                              </div>
                              <div className="text-base">
                                {sampleContent.eventDetails.ceremony.address}
                              </div>
                            </div>
                          </motion.div>
                          
                          {sampleContent.eventDetails.ceremony.notes && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.3
                              }}
                              className="mt-8 p-6 rounded-xl text-center relative z-10"
                              style={{ 
                                backgroundColor: templateConfig?.colors?.accent + '10' || '#f0f0f0',
                                color: templateConfig?.colors?.textSecondary || '#666'
                              }}
                              viewport={{ once: true }}
                            >
                              <div className="italic leading-relaxed">"{sampleContent.eventDetails.ceremony.notes}"</div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                      
                      {/* Resepsi Section */}
                      {sampleContent.eventDetails?.reception && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.4
                          }}
                          whileHover={{ 
                            y: -8,
                            transition: { duration: 0.3 }
                          }}
                          className="rounded-2xl p-8 relative overflow-hidden"
                          style={{ 
                            backgroundColor: templateConfig?.colors?.background || '#ffffff',
                            boxShadow: `0 10px 25px rgba(0, 0, 0, 0.08), 0 5px 10px rgba(0, 0, 0, 0.04)`,
                            border: `1px solid ${templateConfig?.colors?.accent + '20' || '#f0f0f0'}`
                          }}
                          viewport={{ once: true, margin: "-50px" }}
                        >
                          {/* Decorative corner elements */}
                          <div 
                            className="absolute top-0 left-0 w-24 h-24 rounded-br-full opacity-10"
                            style={{ 
                              backgroundColor: templateConfig?.colors?.primary || '#333'
                            }}
                          />
                          <div 
                            className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full opacity-10"
                            style={{ 
                              backgroundColor: templateConfig?.colors?.primary || '#333'
                            }}
                          />
                          
                          <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.3
                            }}
                            className="text-2xl font-bold mb-8 text-center relative z-10"
                            style={{ 
                              color: templateConfig?.colors?.primary || '#333',
                              fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
                            }}
                            viewport={{ once: true }}
                          >
                            {sampleContent.eventDetails.reception.name}
                          </motion.h3>
                          
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.3
                            }}
                            className="space-y-6 text-center relative z-10"
                            style={{ 
                              color: templateConfig?.colors?.text || '#000000',
                              fontFamily: templateConfig?.typography?.bodyFont || 'Inter'
                            }}
                            viewport={{ once: true }}
                          >
                            <div className="pb-6 border-b border-gray-100">
                              <div className="text-lg font-medium mb-3">
                                {sampleContent.eventDetails.reception.date.toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                            
                            <div className="pb-6 border-b border-gray-100">
                              <div className="text-lg font-medium">{sampleContent.eventDetails.reception.time}</div>
                            </div>
                            
                            <div>
                              <div 
                                className="text-xl font-bold mb-2"
                                style={{ color: templateConfig?.colors?.primary || '#333' }}
                              >
                                {sampleContent.eventDetails.reception.venue}
                              </div>
                              <div className="text-base">
                                {sampleContent.eventDetails.reception.address}
                              </div>
                            </div>
                          </motion.div>
                          
                          {sampleContent.eventDetails.reception.notes && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.3
                              }}
                              className="mt-8 p-6 rounded-xl text-center relative z-10"
                              style={{ 
                                backgroundColor: templateConfig?.colors?.accent + '10' || '#f0f0f0',
                                color: templateConfig?.colors?.textSecondary || '#666'
                              }}
                              viewport={{ once: true }}
                            >
                              <div className="italic leading-relaxed">"{sampleContent.eventDetails.reception.notes}"</div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* Gallery Section with Animations */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {sampleContent.gallerySection && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="py-16 px-4 sm:px-6 lg:px-8"
                      style={{ backgroundColor: '#f9f7f4' }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <motion.h2 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4
                        }}
                        className="text-3xl md:text-4xl font-bold text-center mb-12"
                        style={{ 
                          color: templateConfig?.colors?.primary || '#333',
                          fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
                        }}
                        viewport={{ once: true }}
                      >
                        {sampleContent.gallerySection.title}
                      </motion.h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                        {sampleContent.gallerySection.images?.slice(0, 8).map((image, index) => (
                          <motion.div 
                            key={image.id} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              duration: 0.3,
                              delay: index * 0.05
                            }}
                            whileHover={{ 
                              y: -5,
                              scale: 1.03,
                              transition: { duration: 0.2 }
                            }}
                            className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                            viewport={{ once: true, margin: "-50px" }}
                          >
                            <span className="text-gray-600 text-sm font-medium">Foto {image.id}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Gift Section with Full Animations */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {sampleContent.giftSection && (
                    <GiftSection 
                      content={sampleContent.giftSection} 
                      config={templateConfig}
                      sectionConfig={{
                        id: 'gift',
                        type: 'gift',
                        isVisible: true,
                        order: 7,
                        content: sampleContent.giftSection,
                        style: {}
                      }}
                      isPreview={true}
                    />
                  )}
                </motion.div>
                
                {/* Wishes Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {sampleContent.wishesSection && (
                    <WishesSection 
                      config={templateConfig}
                      sectionConfig={{
                        id: 'wishes',
                        type: 'wishes',
                        isVisible: true,
                        order: 8,
                        content: sampleContent.wishesSection,
                        style: {}
                      }}
                      isPreview={true}
                    />
                  )}
                </motion.div>
                
                {/* Closing Section with Full Animations - Moved to the end */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {sampleContent.closingSection && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden"
                      style={{ 
                        backgroundColor: templateConfig?.colors?.primary || '#8b4513',
                        color: '#ffffff'
                      }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      {/* Background decorative elements */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full opacity-10"
                            style={{ 
                              backgroundColor: '#ffffff',
                              left: `${20 + i * 20}%`,
                              top: `${10 + i * 20}%`
                            }}
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.1, 0.15, 0.1]
                            }}
                            transition={{
                              duration: 5 + i,
                              repeat: Infinity,
                              delay: i * 1.5
                            }}
                          />
                        ))}
                      </div>

                      <motion.h2 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4
                        }}
                        className="text-3xl md:text-4xl font-bold mb-8 relative z-10"
                        style={{ fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display' }}
                        viewport={{ once: true }}
                      >
                        {sampleContent.closingSection.title}
                      </motion.h2>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4
                        }}
                        className="text-lg mb-10 max-w-4xl mx-auto leading-relaxed relative z-10"
                        viewport={{ once: true }}
                      >
                        {sampleContent.closingSection.message}
                      </motion.p>
                      
                      {sampleContent.closingSection.gratitudeMessage && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.4
                          }}
                          className="bg-white bg-opacity-90 rounded-xl p-6 max-w-3xl mx-auto mb-10 relative z-10"
                          viewport={{ once: true }}
                        >
                          <p 
                            className="text-base italic leading-relaxed"
                            style={{ color: templateConfig?.colors?.textSecondary || '#666' }}
                          >
                            {sampleContent.closingSection.gratitudeMessage}
                          </p>
                        </motion.div>
                      )}
                      
                      {sampleContent.closingSection.includeThankYou && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.4
                          }}
                          className="mb-10 relative z-10"
                          viewport={{ once: true }}
                        >
                          <h3 className="text-2xl font-bold mb-5">Terima Kasih</h3>
                          <p className="text-lg">Atas kehadiran dan doa restu yang diberikan</p>
                        </motion.div>
                      )}
                      
                      {sampleContent.closingSection.signatureNames && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.4
                          }}
                          className="space-y-3 relative z-10"
                          viewport={{ once: true }}
                        >
                          {sampleContent.closingSection.signatureNames.map((name, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 5 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.3,
                                delay: index * 0.1
                              }}
                              viewport={{ once: true }}
                            >
                              <p className="text-xl font-bold">{name}</p>
                              {index < sampleContent.closingSection!.signatureNames!.length - 1 && (
                                <p className="text-lg my-1">&</p>
                              )}
                            </motion.div>
                          ))}
                          
                          {/* Final decorative element with animation */}
                          <motion.div 
                            initial={{ opacity: 0, scaleX: 0 }}
                            whileInView={{ opacity: 1, scaleX: 1 }}
                            transition={{ 
                              duration: 0.6
                            }}
                            className="mt-10 flex items-center justify-center space-x-4"
                            viewport={{ once: true }}
                          >
                            <div className="w-12 h-px bg-white" />
                            <motion.div 
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              transition={{ 
                                duration: 0.5
                              }}
                              className="w-3 h-3 bg-white rounded-full" 
                              viewport={{ once: true }}
                            />
                            <div className="w-12 h-px bg-white" />
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Floating audio control button - positioned in top-right corner as per specifications */}
      {isOpened && (
        <button
          onClick={toggleAudio}
          className="fixed top-4 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center md:w-12 md:h-12 bg-primary-600 hover:bg-primary-700 transition-all duration-200"
          style={{ 
            backgroundColor: templateConfig?.colors?.primary || '#333',
          }}
          data-testid="audio-control-button"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white md:w-5 md:h-5" />
          ) : (
            <Play className="w-6 h-6 text-white md:w-5 md:h-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default InvitationViewPage;