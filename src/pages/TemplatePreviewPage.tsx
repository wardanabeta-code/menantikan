// Template preview page - shows how the template looks to invitation recipients
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ArrowLeft, ExternalLink, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { getTemplateById } from '../data/sampleTemplates';
import { generateSampleContent } from '../utils/sampleContent';
import type { Template } from '../types';

// Import new section components
import BrideGroomDetailsSection from '../components/sections/BrideGroomDetailsSection';
import SacredTextSection from '../components/sections/SacredTextSection';
import CountdownSection from '../components/sections/CountdownSection';
import WishesSection from '../components/sections/WishesSection';
import GiftSection from '../components/sections/GiftSection';

const TemplatePreviewPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (templateId) {
      const foundTemplate = getTemplateById(templateId);
      setTemplate(foundTemplate || null);
    }
  }, [templateId]);

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Template Not Found</h1>
          <p className="text-gray-600 mb-6">The template you're looking for doesn't exist.</p>
          <Link to="/templates">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sampleContent = generateSampleContent(template.templateId);
  const templateConfig = template.baseConfig;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.close()}
                className="lg:hidden"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Close
              </Button>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="text-xl font-bold">Template Preview</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-right">
                <h2 className="text-lg font-semibold text-gray-900">{template.name}</h2>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
              <span className="text-xs uppercase tracking-wide text-gray-500 bg-gray-100 px-3 py-1 rounded-full self-start sm:self-center">
                {template.category}
              </span>
              <Button
                size="sm"
                onClick={() => {
                  window.open(`/invitation-view/${template.templateId}`, '_blank');
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Maximize className="w-3 h-3 mr-1" />
                Full Screen Preview
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Preview Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-800">Template Preview Mode</span>
              <span className="text-xs text-blue-600">This is how your invitation will appear to guests</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="text-xs text-blue-600">Sample data is shown for demonstration</span>
              <Button
                size="sm"
                onClick={() => {
                  window.open('/templates', '_blank');
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Back to Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Template Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Template Meta Info */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Template:</span>
                  <span className="text-sm text-gray-900">{template.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Category:</span>
                  <span className="text-sm text-gray-900 capitalize">{template.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Popularity:</span>
                  <span className="text-sm text-gray-900">{template.popularity}/100</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actual Template Render with Animations */}
          <div className="invitation-preview" style={{ minHeight: '600px', backgroundColor: '#f9f9f9' }}>
            {template && sampleContent ? (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                {/* Debug Info */}
                <div className="bg-blue-50 p-3 text-xs text-blue-800 border-b hidden md:block">
                  <strong>Debug:</strong> Template ID: {template.templateId}, Sections: {template.baseConfig?.sections?.length || 0}, Content Keys: {Object.keys(sampleContent).join(', ')}
                </div>
                
                {/* Animated Template Preview */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="p-0"
                  style={{ 
                    backgroundColor: templateConfig?.colors?.background || '#ffffff',
                    color: templateConfig?.colors?.text || '#000000',
                    fontFamily: templateConfig?.typography?.bodyFont || 'Inter'
                  }}
                >
                  {/* Hero Section with Animation */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
                    style={{ backgroundColor: templateConfig?.colors?.background || '#ffffff' }}
                  >
                    {/* Floating particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full opacity-30"
                          style={{ 
                            backgroundColor: templateConfig?.colors?.accent || '#d4af37',
                            left: `${15 + i * 15}%`,
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
                    
                    {/* Couple Nicknames - Most Prominent */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 relative z-10"
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
                    
                    {/* Event Date */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-lg sm:text-xl md:text-2xl font-medium mb-2"
                      style={{ color: templateConfig?.colors?.textSecondary || '#666' }}
                    >
                      {sampleContent.eventDetails?.ceremony 
                        ? sampleContent.eventDetails.ceremony.date.toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : '15 Juni 2024'}
                    </motion.div>
                    
                    {/* "Kami mengundang" text */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
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
                      {sampleContent.heroSection?.subtitle || 'Untuk Menghadiri Resepsi Pernikahan Kami'}
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
                  
                  {/* Countdown Section - Moved to Hero Section */}
                  {sampleContent.countdownSection && sampleContent.eventDetails?.ceremony && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.6 }}
                      className="mt-8"
                    >
                      <CountdownSection 
                        event={sampleContent.eventDetails.ceremony}
                        templateConfig={templateConfig}
                        title={sampleContent.countdownSection.title}
                      />
                    </motion.div>
                  )}
                  
                  {/* Sacred Text Section - Moved to right after Hero Section */}
                  {sampleContent.sacredTextSection && (
                    <SacredTextSection 
                      content={sampleContent.sacredTextSection} 
                      templateConfig={templateConfig}
                    />
                  )}
                  
                  {/* Removed Countdown Section from here since it's now in Hero Section */}
                  {/* Bride and Groom Details Section */}
                  {sampleContent.brideGroomDetailsSection && (
                    <BrideGroomDetailsSection 
                      content={sampleContent.brideGroomDetailsSection} 
                      templateConfig={templateConfig}
                    />
                  )}
                  
                  {/* Story Section with Animation */}
                  {sampleContent.storySection && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="py-12 px-4 sm:px-6 lg:px-8"
                      style={{ backgroundColor: '#f9f7f4' }}
                    >
                      <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-3xl font-bold text-center mb-12"
                        style={{ 
                          color: templateConfig?.colors?.primary || '#333',
                          fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
                        }}
                      >
                        {sampleContent.storySection.title}
                      </motion.h2>
                      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {sampleContent.storySection.timeline?.map((item, index) => (
                          <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
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
                  
                  {/* Gallery Section */}
                  {sampleContent.gallerySection && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="py-12 px-4 sm:px-6 lg:px-8"
                      style={{ backgroundColor: '#f9f7f4' }}
                    >
                      <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-3xl font-bold text-center mb-12"
                        style={{ 
                          color: templateConfig?.colors?.primary || '#333',
                          fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display'
                        }}
                      >
                        {sampleContent.gallerySection.title}
                      </motion.h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                        {sampleContent.gallerySection.images?.slice(0, 8).map((image, index) => (
                          <motion.div 
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                            whileHover={{ scale: 1.05, boxShadow: "0 8px 16px rgba(0,0,0,0.15)" }}
                            className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shadow-sm"
                          >
                            <span className="text-gray-600 text-xs sm:text-sm font-medium">Foto {image.id}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Gift Section */}
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
                  
                  {/* Wishes Section */}
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
                  
                  {/* Removed duplicate RSVP Section since attendance confirmation is in WishesSection dropdown */}
                  
                  {/* Closing Section - Moved to the end */}
                  {sampleContent.closingSection && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
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
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-3xl font-bold mb-6 relative z-10"
                        style={{ fontFamily: templateConfig?.typography?.headingFont || 'Playfair Display' }}
                      >
                        {sampleContent.closingSection.title}
                      </motion.h2>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-base sm:text-lg mb-8 max-w-3xl mx-auto leading-relaxed relative z-10"
                      >
                        {sampleContent.closingSection.message}
                      </motion.p>
                      
                      {sampleContent.closingSection.gratitudeMessage && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                          className="bg-white bg-opacity-90 rounded-lg p-6 max-w-2xl mx-auto mb-8 relative z-10"
                        >
                          <p 
                            className="text-sm sm:text-base italic leading-relaxed"
                            style={{ color: templateConfig?.colors?.textSecondary || '#666' }}
                          >
                            {sampleContent.closingSection.gratitudeMessage}
                          </p>
                        </motion.div>
                      )}
                      
                      {sampleContent.closingSection.includeThankYou && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                          className="mb-8 relative z-10"
                        >
                          <h3 className="text-xl sm:text-2xl font-bold mb-4">Terima Kasih</h3>
                          <p className="text-base sm:text-lg">Atas kehadiran dan doa restu yang diberikan</p>
                        </motion.div>
                      )}
                      
                      {sampleContent.closingSection.signatureNames && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 1.0 }}
                          className="space-y-3 relative z-10"
                        >
                          {sampleContent.closingSection.signatureNames.map((name, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                            >
                              <p className="text-lg sm:text-xl font-bold">{name}</p>
                              {index < sampleContent.closingSection!.signatureNames!.length - 1 && (
                                <p className="text-base sm:text-lg my-1">&</p>
                              )}
                            </motion.div>
                          ))}
                          
                          {/* Final decorative element */}
                          <motion.div 
                            initial={{ opacity: 0, scaleX: 0 }}
                            whileInView={{ opacity: 1, scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 1.5 }}
                            className="mt-8 flex items-center justify-center space-x-3"
                          >
                            <div className="w-10 h-px bg-white" />
                            <motion.div 
                              initial={{ scale: 0, rotate: 0 }}
                              whileInView={{ scale: 1, rotate: 360 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 1.7 }}
                              className="w-2 h-2 bg-white rounded-full" 
                            />
                            <div className="w-10 h-px bg-white" />
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-100 text-gray-500">
                No template or content available
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to use this template?</h3>
            <p className="text-gray-600 mb-4">
              This preview shows how your invitation will look with your custom content.
              You can customize colors, fonts, images, and all text content with smooth animations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  window.open(`/invitation-view/${template.templateId}`, '_blank');
                }}
                className="px-8 bg-green-600 hover:bg-green-700"
              >
                <Maximize className="w-4 h-4 mr-2" />
                Preview Full Screen
              </Button>
              <Button
                onClick={() => {
                  // If opened from template gallery, send message to parent window
                  if (window.opener) {
                    window.opener.postMessage({
                      type: 'USE_TEMPLATE',
                      templateId: template.templateId
                    }, window.location.origin);
                    window.close();
                  } else {
                    // Fallback: redirect to templates page
                    window.open('/templates', '_self');
                  }
                }}
                className="px-8"
              >
                Use This Template
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (window.opener) {
                    window.close();
                  } else {
                    window.open('/templates', '_self');
                  }
                }}
              >
                Back to Gallery
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TemplatePreviewPage;