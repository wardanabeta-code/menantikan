// TemplateRenderer component with dynamic theming
import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { 
  Template, 
  TemplateConfig, 
  InvitationContent, 
  DeepPartial,
  SectionConfig,
  SectionType
} from '../types';
import HeroSection from './sections/HeroSection';
import StorySection from './sections/StorySection';
import EventDetailsSection from './sections/EventDetailsSection';
import RSVPSection from './sections/RSVPSection';
import GallerySection from './sections/GallerySection';
import GuestbookSection from './sections/GuestbookSection';
import MapSection from './sections/MapSection';
import CountdownSection from './sections/CountdownSection';
import GiftSection from './sections/GiftSection';
import ClosingSection from './sections/ClosingSection';

interface TemplateRendererProps {
  template: Template;
  content: InvitationContent;
  customizations?: DeepPartial<TemplateConfig>;
  isPreview?: boolean;
  className?: string;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  content,
  customizations = {},
  isPreview = false,
  className = ''
}) => {
  // Merge base template config with customizations
  const finalConfig = useMemo(() => {
    // Handle both template.config and template.baseConfig for backward compatibility
    const baseConfig = template.baseConfig || (template as any).config;
    if (!baseConfig) {
      throw new Error('Template must have either baseConfig or config property');
    }
    
    // Normalize the base config to ensure sections is an array
    const normalizedBaseConfig = {
      ...baseConfig,
      sections: normalizeSections(baseConfig.sections)
    };
    
    return mergeConfigs(normalizedBaseConfig, customizations);
  }, [template, customizations]);

  // Apply dynamic theming
  useEffect(() => {
    if (finalConfig.colors) {
      const root = document.documentElement;
      
      // Apply template color variables
      if (finalConfig.colors.primary) {
        const { h, s, l } = hexToHsl(finalConfig.colors.primary);
        root.style.setProperty('--template-primary-hue', h.toString());
        root.style.setProperty('--template-primary-saturation', `${s}%`);
        root.style.setProperty('--template-primary-lightness', `${l}%`);
      }
      
      if (finalConfig.colors.secondary) {
        const { h, s, l } = hexToHsl(finalConfig.colors.secondary);
        root.style.setProperty('--template-secondary-hue', h.toString());
        root.style.setProperty('--template-secondary-saturation', `${s}%`);
        root.style.setProperty('--template-secondary-lightness', `${l}%`);
      }
      
      if (finalConfig.colors.accent) {
        const { h, s, l } = hexToHsl(finalConfig.colors.accent);
        root.style.setProperty('--template-accent-hue', h.toString());
        root.style.setProperty('--template-accent-saturation', `${s}%`);
        root.style.setProperty('--template-accent-lightness', `${l}%`);
      }
    }

    // Apply typography variables
    if (finalConfig.typography) {
      const root = document.documentElement;
      if (finalConfig.typography.headingFont) {
        root.style.setProperty('--font-heading', finalConfig.typography.headingFont);
      }
      if (finalConfig.typography.bodyFont) {
        root.style.setProperty('--font-body', finalConfig.typography.bodyFont);
      }
    }
  }, [finalConfig]);

  // Get ordered sections
  const orderedSections = useMemo(() => {
    return finalConfig.sections
      .filter(section => section.isVisible)
      .sort((a, b) => a.order - b.order);
  }, [finalConfig.sections]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: finalConfig.animations?.staggerDelay || 0.1,
        duration: finalConfig.animations?.duration || 0.3
      }
    }
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: finalConfig.animations?.duration || 0.3
      }
    }
  };

  return (
    <motion.div
      className={`template-theme ${className}`}
      style={{
        maxWidth: finalConfig.layout?.maxWidth || '100%',
        padding: finalConfig.layout?.padding || '0',
        borderRadius: finalConfig.layout?.borderRadius || '0'
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {orderedSections.map((section) => (
        <motion.div
          key={section.id}
          variants={finalConfig.animations?.enabled ? sectionVariants : undefined}
          style={{
            marginBottom: finalConfig.layout?.spacing || 'var(--spacing-invitation-md)'
          }}
        >
          {renderSection(section, content, finalConfig, isPreview)}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Section renderer function
const renderSection = (
  section: SectionConfig,
  content: InvitationContent,
  config: TemplateConfig,
  isPreview: boolean
) => {
  const commonProps = {
    config,
    isPreview,
    sectionConfig: section
  };

  switch (section.type) {
    case 'hero':
      return (
        <HeroSection
          {...commonProps}
          content={content.heroSection}
        />
      );
      
    case 'story':
      return content.storySection ? (
        <StorySection
          {...commonProps}
          content={content.storySection}
        />
      ) : null;
      
    case 'event-details':
      return (
        <EventDetailsSection
          {...commonProps}
          content={content.eventDetails}
        />
      );
      
    case 'rsvp':
      return (
        <RSVPSection
          {...commonProps}
        />
      );
      
    case 'gallery':
      return content.gallerySection ? (
        <GallerySection
          {...commonProps}
          content={content.gallerySection}
        />
      ) : null;
      
    case 'guestbook':
      return (
        <GuestbookSection
          {...commonProps}
        />
      );
      
    case 'map':
      return (
        <MapSection
          {...commonProps}
          content={content.eventDetails}
        />
      );
      
    case 'countdown':
      // Determine which event to use for the countdown
      let countdownEvent = content.eventDetails?.ceremony;
      if (content.countdownSection?.targetEvent === 'reception') {
        countdownEvent = content.eventDetails?.reception;
      } else if (content.countdownSection?.targetEvent === 'custom' && content.countdownSection.customDate) {
        // For custom date, we create a temporary event object
        countdownEvent = {
          name: content.countdownSection.title || 'Acara Khusus',
          date: content.countdownSection.customDate,
          time: '00:00',
          venue: '',
          address: ''
        };
      }
      
      // Only render countdown if we have a valid event
      return countdownEvent ? (
        <CountdownSection
          {...commonProps}
          event={countdownEvent}
          title={content.countdownSection?.title}
        />
      ) : null;
      
    case 'gift':
      return content.giftSection ? (
        <GiftSection
          {...commonProps}
          content={content.giftSection}
        />
      ) : null;
      
    case 'closing':
      return content.closingSection ? (
        <ClosingSection
          {...commonProps}
          content={content.closingSection}
        />
      ) : null;
      
    default:
      return null;
  }
};

// Helper functions
const mergeConfigs = (
  baseConfig: TemplateConfig | undefined,
  customizations: DeepPartial<TemplateConfig>
): TemplateConfig => {
  if (!baseConfig) {
    // Return a basic config structure if baseConfig is undefined
    return {
      layout: customizations.layout || {},
      colors: customizations.colors || {},
      typography: customizations.typography || {},
      sections: normalizeSections(customizations.sections || []),
      animations: customizations.animations || {}
    } as TemplateConfig;
  }
  
  // Normalize base sections first
  const normalizedBaseSections = normalizeSections(baseConfig.sections);
  
  // If customizations has sections, merge them
  let finalSections = normalizedBaseSections;
  if (customizations.sections) {
    const customSections = normalizeSections(customizations.sections);
    
    // Merge customizations into base sections
    finalSections = normalizedBaseSections.map(baseSection => {
      const customSection = customSections.find(c => c.id === baseSection.id);
      if (customSection) {
        return {
          ...baseSection,
          content: { ...baseSection.content, ...customSection.content },
          isVisible: customSection.isVisible !== undefined ? customSection.isVisible : baseSection.isVisible
        };
      }
      return baseSection;
    });
    
    // Add any new sections from customizations that don't exist in base
    customSections.forEach(customSection => {
      if (!finalSections.find(s => s.id === customSection.id)) {
        finalSections.push(customSection);
      }
    });
  }
  
  return {
    layout: { ...(baseConfig.layout || {}), ...(customizations.layout || {}) },
    colors: { ...(baseConfig.colors || {}), ...(customizations.colors || {}) },
    typography: {
      fontFamily: (customizations.typography?.fontFamily || baseConfig.typography?.fontFamily || 'Inter'),
      headingFont: (customizations.typography?.headingFont || baseConfig.typography?.headingFont || 'Inter'),
      bodyFont: (customizations.typography?.bodyFont || baseConfig.typography?.bodyFont || 'Inter'),
      fontSize: {
        xs: customizations.typography?.fontSize?.xs || baseConfig.typography?.fontSize?.xs || '0.75rem',
        sm: customizations.typography?.fontSize?.sm || baseConfig.typography?.fontSize?.sm || '0.875rem',
        base: customizations.typography?.fontSize?.base || baseConfig.typography?.fontSize?.base || '1rem',
        lg: customizations.typography?.fontSize?.lg || baseConfig.typography?.fontSize?.lg || '1.125rem',
        xl: customizations.typography?.fontSize?.xl || baseConfig.typography?.fontSize?.xl || '1.25rem',
        '2xl': customizations.typography?.fontSize?.['2xl'] || baseConfig.typography?.fontSize?.['2xl'] || '1.5rem',
        '3xl': customizations.typography?.fontSize?.['3xl'] || baseConfig.typography?.fontSize?.['3xl'] || '1.875rem',
        '4xl': customizations.typography?.fontSize?.['4xl'] || baseConfig.typography?.fontSize?.['4xl'] || '2.25rem'
      }
    },
    sections: finalSections,
    animations: { ...(baseConfig.animations || {}), ...(customizations.animations || {}) }
  };
};

// Convert legacy section object format to array format
const normalizeSections = (sections: any): SectionConfig[] => {
  // If already an array, return it
  if (Array.isArray(sections)) {
    return sections;
  }
  
  // If it's an object (legacy format), convert to array
  if (sections && typeof sections === 'object') {
    const sectionArray: SectionConfig[] = [];
    let order = 0;
    
    // Convert each section type to SectionConfig format
    Object.entries(sections).forEach(([key, config]: [string, any]) => {
      if (config && typeof config === 'object') {
        sectionArray.push({
          id: key,
          type: key as SectionType,
          isVisible: config.enabled !== false,
          order: order++,
          content: config,
          style: {}
        });
      }
    });
    
    return sectionArray;
  }
  
  // Return empty array if invalid format
  return [];
};

const hexToHsl = (hex: string) => {
  // Remove the hash if it exists
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

export default TemplateRenderer;