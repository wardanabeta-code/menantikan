import React from 'react';
import { motion } from 'framer-motion';
import type { Invitation, InvitationContent, TemplateConfig } from '@/types';

// Import section components for preview
import BrideGroomDetailsSection from '../sections/BrideGroomDetailsSection';
import SacredTextSection from '../sections/SacredTextSection';
import StorySection from '../sections/StorySection';
import EventDetailsSection from '../sections/EventDetailsSection';
import GallerySection from '../sections/GallerySection';
import CountdownSection from '../sections/CountdownSection';
import GiftSection from '../sections/GiftSection';
import WishesSection from '../sections/WishesSection';
import ClosingSection from '../sections/ClosingSection';

interface EditorPreviewProps {
  invitation: Invitation;
  formData: Partial<InvitationContent>;
  className?: string;
}

const EditorPreview: React.FC<EditorPreviewProps> = ({ invitation, formData, className = '' }) => {
  // Create a complete template config from the partial customTheme
  const templateConfig: TemplateConfig = {
    layout: {
      maxWidth: invitation.customTheme?.layout?.maxWidth || '100%',
      padding: invitation.customTheme?.layout?.padding || '1rem',
      spacing: invitation.customTheme?.layout?.spacing || '1rem',
      borderRadius: invitation.customTheme?.layout?.borderRadius || '0.5rem'
    },
    colors: {
      primary: invitation.customTheme?.colors?.primary || '#333333',
      secondary: invitation.customTheme?.colors?.secondary || '#666666',
      accent: invitation.customTheme?.colors?.accent || '#d4af37',
      background: invitation.customTheme?.colors?.background || '#ffffff',
      text: invitation.customTheme?.colors?.text || '#000000',
      textSecondary: invitation.customTheme?.colors?.textSecondary || '#666666',
      border: invitation.customTheme?.colors?.border || '#e5e5e5'
    },
    typography: {
      fontFamily: invitation.customTheme?.typography?.fontFamily || 'Inter, sans-serif',
      headingFont: invitation.customTheme?.typography?.headingFont || 'Playfair Display, serif',
      bodyFont: invitation.customTheme?.typography?.bodyFont || 'Inter, sans-serif',
      fontSize: {
        xs: invitation.customTheme?.typography?.fontSize?.xs || '0.75rem',
        sm: invitation.customTheme?.typography?.fontSize?.sm || '0.875rem',
        base: invitation.customTheme?.typography?.fontSize?.base || '1rem',
        lg: invitation.customTheme?.typography?.fontSize?.lg || '1.125rem',
        xl: invitation.customTheme?.typography?.fontSize?.xl || '1.25rem',
        '2xl': invitation.customTheme?.typography?.fontSize?.['2xl'] || '1.5rem',
        '3xl': invitation.customTheme?.typography?.fontSize?.['3xl'] || '1.875rem',
        '4xl': invitation.customTheme?.typography?.fontSize?.['4xl'] || '2.25rem'
      }
    },
    sections: invitation.customTheme?.sections || [],
    animations: {
      enabled: invitation.customTheme?.animations?.enabled !== undefined ? invitation.customTheme?.animations?.enabled : true,
      duration: invitation.customTheme?.animations?.duration || 0.5,
      easing: invitation.customTheme?.animations?.easing || 'easeInOut',
      staggerDelay: invitation.customTheme?.animations?.staggerDelay || 0.1
    }
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Mobile Preview Panel */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Mobile Device Frame */}
            <div className="bg-gray-800 p-4 rounded-t-lg">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                <div className="w-24 h-4 bg-gray-700 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
              </div>
            </div>
            
            {/* Preview Content */}
            <div className="bg-white h-[600px] overflow-y-auto">
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
                  {formData.brideGroomDetailsSection 
                    ? `${formData.brideGroomDetailsSection.bride.nickname} & ${formData.brideGroomDetailsSection.groom.nickname}`
                    : (formData.heroSection?.coupleNames 
                        ? formData.heroSection.coupleNames.join(' & ')
                        : 'Budi & Ani')}
                </motion.div>
                
                {/* Countdown Section */}
                {formData.countdownSection && formData.eventDetails?.ceremony && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-8"
                  >
                    <CountdownSection 
                      event={formData.eventDetails.ceremony}
                      templateConfig={templateConfig}
                      title={formData.countdownSection.title}
                    />
                  </motion.div>
                )}
                
                {/* "Kami mengundang" text */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  className="text-xl sm:text-2xl md:text-3xl font-medium mb-6"
                  style={{ color: templateConfig?.colors?.primary || '#333' }}
                >
                  Kami Mengundang
                </motion.div>
                
                {/* Subtitle */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  className="text-base sm:text-lg md:text-xl mb-8 max-w-xl mx-auto"
                  style={{ color: templateConfig?.colors?.textSecondary || '#666' }}
                >
                  {formData.heroSection?.subtitle || 'Untuk Menghadiri Resepsi Pernikahan Kami'}
                </motion.div>
                
                {/* Decorative line with animation */}
                <motion.div 
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="flex items-center justify-center mt-6 space-x-4 mb-8"
                >
                  <div 
                    className="w-12 sm:w-16 h-px"
                    style={{ backgroundColor: templateConfig?.colors?.accent || '#d4af37' }}
                  />
                  <motion.div 
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                    className="w-2 sm:w-3 h-2 sm:h-3 rounded-full"
                    style={{ backgroundColor: templateConfig?.colors?.accent || '#d4af37' }}
                  />
                  <div 
                    className="w-12 sm:w-16 h-px"
                    style={{ backgroundColor: templateConfig?.colors?.accent || '#d4af37' }}
                  />
                </motion.div>
              </motion.div>
              
              {/* Sacred Text Section - Moved to right after Hero Section */}
              {formData.sacredTextSection && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                >
                  <SacredTextSection 
                    content={formData.sacredTextSection} 
                    templateConfig={templateConfig}
                  />
                </motion.div>
              )}
              
              {/* Bride and Groom Details Section */}
              {formData.brideGroomDetailsSection && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                >
                  <BrideGroomDetailsSection 
                    content={formData.brideGroomDetailsSection} 
                    templateConfig={templateConfig}
                  />
                </motion.div>
              )}
              
              {/* Story Section with Animation */}
              {formData.storySection && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="py-12 px-4 sm:px-6 lg:px-8"
                  style={{ backgroundColor: '#f9f7f4' }}
                >
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-2xl md:text-3xl font-bold text-center mb-12"
                    style={{ 
                      color: templateConfig?.colors?.primary || '#333',
                      fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
                    }}
                  >
                    {formData.storySection.title}
                  </motion.h2>
                  <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {formData.storySection.timeline?.map((item, index) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                        className="text-center p-6 bg-white rounded-lg shadow-sm cursor-pointer"
                      >
                        <div 
                          className="text-xs sm:text-sm font-medium mb-2"
                          style={{ color: templateConfig?.colors?.accent || '#d4af37' }}
                        >
                          {item.date}
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-4">{item.title}</h3>
                        <p className="text-sm sm:text-base" style={{ color: templateConfig?.colors?.textSecondary || '#666' }}>
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Event Details Section with Animations */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-16 px-4 sm:px-6 lg:px-8"
                  style={{ 
                    backgroundColor: templateConfig?.colors?.background || '#ffffff',
                    fontFamily: templateConfig?.typography?.bodyFont || 'Inter'
                  }}
                >
                  <motion.h2 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4
                    }}
                    className="text-3xl md:text-4xl font-bold mb-12"
                    style={{ 
                      color: templateConfig?.colors?.primary || '#333',
                      fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
                    }}
                  >
                    Detail Acara
                  </motion.h2>
                  
                  <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Akad/Pemberkatan Section */}
                    {formData.eventDetails?.ceremony && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4
                        }}
                        className="rounded-2xl p-8 relative overflow-hidden"
                        style={{ 
                          backgroundColor: templateConfig?.colors?.background || '#ffffff',
                          boxShadow: `0 10px 25px rgba(0, 0, 0, 0.08), 0 5px 10px rgba(0, 0, 0, 0.04)`,
                          border: `1px solid ${templateConfig?.colors?.accent + '20' || '#f0f0f0'}`
                        }}
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
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.3
                          }}
                          className="text-2xl font-bold mb-8 text-center relative z-10"
                          style={{ 
                            color: templateConfig?.colors?.primary || '#333',
                            fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
                          }}
                        >
                          {formData.eventDetails.ceremony.name}
                        </motion.h3>
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.3
                          }}
                          className="space-y-6 text-center relative z-10"
                          style={{ 
                            color: templateConfig?.colors?.text || '#000000',
                            fontFamily: templateConfig?.typography?.bodyFont || 'Inter'
                          }}
                        >
                          <div className="pb-6 border-b border-gray-100">
                            <div className="text-lg font-medium mb-3">
                              {formData.eventDetails.ceremony.date.toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          
                          <div className="pb-6 border-b border-gray-100">
                            <div className="text-lg font-medium">{formData.eventDetails.ceremony.time}</div>
                          </div>
                          
                          <div>
                            <div 
                              className="text-xl font-bold mb-2"
                              style={{ color: templateConfig?.colors?.primary || '#333' }}
                            >
                              {formData.eventDetails.ceremony.venue}
                            </div>
                            <div className="text-base">
                              {formData.eventDetails.ceremony.address}
                            </div>
                          </div>
                        </motion.div>
                        
                        {formData.eventDetails.ceremony.notes && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.3
                            }}
                            className="mt-8 p-6 rounded-xl text-center relative z-10"
                            style={{ 
                              backgroundColor: templateConfig?.colors?.accent + '10' || '#f0f0f0',
                              color: templateConfig?.colors?.textSecondary || '#666'
                            }}
                          >
                            <div className="italic leading-relaxed">"{formData.eventDetails.ceremony.notes}"</div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                    
                    {/* Resepsi Section */}
                    {formData.eventDetails?.reception && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4
                        }}
                        className="rounded-2xl p-8 relative overflow-hidden"
                        style={{ 
                          backgroundColor: templateConfig?.colors?.background || '#ffffff',
                          boxShadow: `0 10px 25px rgba(0, 0, 0, 0.08), 0 5px 10px rgba(0, 0, 0, 0.04)`,
                          border: `1px solid ${templateConfig?.colors?.accent + '20' || '#f0f0f0'}`
                        }}
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
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.3
                          }}
                          className="text-2xl font-bold mb-8 text-center relative z-10"
                          style={{ 
                            color: templateConfig?.colors?.primary || '#333',
                            fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
                          }}
                        >
                          {formData.eventDetails.reception.name}
                        </motion.h3>
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.3
                          }}
                          className="space-y-6 text-center relative z-10"
                          style={{ 
                            color: templateConfig?.colors?.text || '#000000',
                            fontFamily: templateConfig?.typography?.bodyFont || 'Inter'
                          }}
                        >
                          <div className="pb-6 border-b border-gray-100">
                            <div className="text-lg font-medium mb-3">
                              {formData.eventDetails.reception.date.toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          
                          <div className="pb-6 border-b border-gray-100">
                            <div className="text-lg font-medium">{formData.eventDetails.reception.time}</div>
                          </div>
                          
                          <div>
                            <div 
                              className="text-xl font-bold mb-2"
                              style={{ color: templateConfig?.colors?.primary || '#333' }}
                            >
                              {formData.eventDetails.reception.venue}
                            </div>
                            <div className="text-base">
                              {formData.eventDetails.reception.address}
                            </div>
                          </div>
                        </motion.div>
                        
                        {formData.eventDetails.reception.notes && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.3
                            }}
                            className="mt-8 p-6 rounded-xl text-center relative z-10"
                            style={{ 
                              backgroundColor: templateConfig?.colors?.accent + '10' || '#f0f0f0',
                              color: templateConfig?.colors?.textSecondary || '#666'
                            }}
                          >
                            <div className="italic leading-relaxed">"{formData.eventDetails.reception.notes}"</div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Gallery Section */}
              {formData.gallerySection && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="py-12 px-4 sm:px-6 lg:px-8"
                  style={{ backgroundColor: '#f9f7f4' }}
                >
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-2xl md:text-3xl font-bold text-center mb-12"
                    style={{ 
                      color: templateConfig?.colors?.primary || '#333',
                      fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
                    }}
                  >
                    {formData.gallerySection.title}
                  </motion.h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                    {formData.gallerySection.images?.slice(0, 8).map((image, index) => (
                      <motion.div 
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                        className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shadow-sm"
                      >
                        <span className="text-gray-600 text-xs sm:text-sm font-medium">Foto {image.id}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Gift Section */}
              {formData.giftSection && (
                <GiftSection 
                  content={formData.giftSection} 
                  config={templateConfig}
                  sectionConfig={{
                    id: 'gift',
                    type: 'gift',
                    isVisible: true,
                    order: 8,
                    content: formData.giftSection,
                    style: {}
                  }}
                />
              )}
              
              {/* Wishes Section */}
              {formData.wishesSection && (
                <WishesSection 
                  config={templateConfig}
                  sectionConfig={{
                    id: 'wishes',
                    type: 'wishes',
                    isVisible: true,
                    order: 9,
                    content: formData.wishesSection,
                    style: {}
                  }}
                />
              )}
              
              {/* Closing Message */}
              {formData.closingSection && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden"
                  style={{ 
                    backgroundColor: templateConfig?.colors?.primary || '#8b4513',
                    color: '#ffffff'
                  }}
                >
                  {/* Background decorative elements */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-24 h-24 rounded-full opacity-10"
                        style={{ 
                          backgroundColor: '#ffffff',
                          left: `${25 + i * 25}%`,
                          top: `${15 + i * 15}%`
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
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-2xl md:text-3xl font-bold mb-6 relative z-10"
                    style={{ fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display' }}
                  >
                    {formData.closingSection.title}
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-base sm:text-lg mb-8 max-w-3xl mx-auto leading-relaxed relative z-10"
                  >
                    {formData.closingSection.message}
                  </motion.p>
                  
                  {formData.closingSection.gratitudeMessage && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="bg-white bg-opacity-90 rounded-lg p-6 max-w-2xl mx-auto mb-8 relative z-10"
                    >
                      <p 
                        className="text-sm sm:text-base italic leading-relaxed"
                        style={{ color: templateConfig?.colors?.textSecondary || '#666' }}
                      >
                        {formData.closingSection.gratitudeMessage}
                      </p>
                    </motion.div>
                  )}
                  
                  {formData.closingSection.includeThankYou && (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="mb-8 relative z-10"
                    >
                      <h3 className="text-xl sm:text-2xl font-bold mb-4">Terima Kasih</h3>
                      <p className="text-base sm:text-lg">Atas kehadiran dan doa restu yang diberikan</p>
                    </motion.div>
                  )}
                  
                  {formData.closingSection.signatureNames && (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.0 }}
                      className="space-y-3 relative z-10"
                    >
                      {formData.closingSection.signatureNames.map((name, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                        >
                          <p className="text-lg sm:text-xl font-bold">{name}</p>
                          {index < formData.closingSection!.signatureNames!.length - 1 && (
                            <p className="text-base sm:text-lg my-1">&</p>
                          )}
                        </motion.div>
                      ))}
                      
                      {/* Final decorative element */}
                      <motion.div 
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        className="mt-8 flex items-center justify-center space-x-3"
                      >
                        <div className="w-10 h-px bg-white" />
                        <motion.div 
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{ scale: 1, rotate: 360 }}
                          transition={{ duration: 0.8, delay: 1.7 }}
                          className="w-2 h-2 bg-white rounded-full" 
                        />
                        <div className="w-10 h-px bg-white" />
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
            
            {/* Mobile Navigation Bar */}
            <div className="bg-gray-800 p-2 flex justify-center">
              <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Sections Panel */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sections</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Hero Section</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={true}
                  className="sr-only"
                  readOnly
                />
                <div className="block w-10 h-6 rounded-full bg-pink-600"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Bride & Groom Details</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={!!formData.brideGroomDetailsSection}
                  className="sr-only"
                  readOnly
                />
                <div className={`block w-10 h-6 rounded-full ${formData.brideGroomDetailsSection ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.brideGroomDetailsSection ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Sacred Text</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={!!formData.sacredTextSection}
                  className="sr-only"
                  readOnly
                />
                <div className={`block w-10 h-6 rounded-full ${formData.sacredTextSection ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.sacredTextSection ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Story Section</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={!!formData.storySection}
                  className="sr-only"
                  readOnly
                />
                <div className={`block w-10 h-6 rounded-full ${formData.storySection ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.storySection ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Event Details</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={true}
                  className="sr-only"
                  readOnly
                />
                <div className="block w-10 h-6 rounded-full bg-pink-600"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Gallery</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={!!formData.gallerySection}
                  className="sr-only"
                  readOnly
                />
                <div className={`block w-10 h-6 rounded-full ${formData.gallerySection ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.gallerySection ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Countdown</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={!!formData.countdownSection}
                  className="sr-only"
                  readOnly
                />
                <div className={`block w-10 h-6 rounded-full ${formData.countdownSection ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.countdownSection ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Gift Information</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={!!formData.giftSection}
                  className="sr-only"
                  readOnly
                />
                <div className={`block w-10 h-6 rounded-full ${formData.giftSection ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.giftSection ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Wishes Section</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={!!formData.wishesSection}
                  className="sr-only"
                  readOnly
                />
                <div className={`block w-10 h-6 rounded-full ${formData.wishesSection ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.wishesSection ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Closing Message</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={!!formData.closingSection}
                  className="sr-only"
                  readOnly
                />
                <div className={`block w-10 h-6 rounded-full ${formData.closingSection ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.closingSection ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              onClick={() => window.open(`/invitation-view/${invitation.templateId}?id=${invitation.invitationId}`, '_blank')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview Invitation
            </button>
            <button 
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPreview;