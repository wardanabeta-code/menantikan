// TemplateRenderer component with dynamic theming
import React, { useEffect, useMemo } from 'react';
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
import BrideGroomDetailsSection from './sections/BrideGroomDetailsSection';
import SacredTextSection from './sections/SacredTextSection';
import WishesSection from './sections/WishesSection';
import WishesMessagesSection from './sections/WishesMessagesSection';

interface TemplateRendererProps {
  template: Template;
  content: InvitationContent;
  customizations?: DeepPartial<TemplateConfig>;
  isPreview?: boolean;
  className?: string;
  skipHeroSection?: boolean; // New prop to skip hero section rendering
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  content,
  customizations = {},
  isPreview = false,
  className = '',
  skipHeroSection = false // Default to false
}) => {
  try {
    // Debug information
    console.log('TemplateRenderer rendering with:', {
      template,
      content,
      customizations,
      isPreview
    });
    
    // Merge base template config with customizations
    const finalConfig = useMemo(() => {
      try {
        // Handle both template.config and template.baseConfig for backward compatibility
        const baseConfig = template.baseConfig || (template as any).config;
        if (!baseConfig) {
          console.warn('Template must have either baseConfig or config property');
          // Return a default config to prevent white screen
          return {
            layout: {
              maxWidth: '100%',
              padding: '1rem',
              spacing: '1rem',
              borderRadius: '0.5rem'
            },
            colors: {
              primary: '#333333',
              secondary: '#666666',
              accent: '#d4af37',
              background: '#ffffff',
              text: '#000000',
              textSecondary: '#666666',
              border: '#e5e5e5'
            },
            typography: {
              fontFamily: 'Inter, sans-serif',
              headingFont: 'Playfair Display, serif',
              bodyFont: 'Inter, sans-serif',
              fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem'
              }
            },
            sections: [],
            animations: {
              enabled: true,
              duration: 0.5,
              easing: 'easeInOut',
              staggerDelay: 0.1
            }
          };
        }
        
        // Normalize the base config to ensure sections is an array
        const normalizedBaseConfig = {
          ...baseConfig,
          sections: normalizeSections(baseConfig.sections)
        };
        
        return mergeConfigs(normalizedBaseConfig, customizations);
      } catch (error) {
        console.error('Error merging template configs:', error);
        // Return a safe default config
        return {
          layout: {
            maxWidth: '100%',
            padding: '1rem',
            spacing: '1rem',
            borderRadius: '0.5rem'
          },
          colors: {
            primary: '#333333',
            secondary: '#666666',
            accent: '#d4af37',
            background: '#ffffff',
            text: '#000000',
            textSecondary: '#666666',
            border: '#e5e5e5'
          },
          typography: {
            fontFamily: 'Inter, sans-serif',
            headingFont: 'Playfair Display, serif',
            bodyFont: 'Inter, sans-serif',
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
              base: '1rem',
              lg: '1.125rem',
              xl: '1.25rem',
              '2xl': '1.5rem',
              '3xl': '1.875rem',
              '4xl': '2.25rem'
            }
          },
          sections: [],
          animations: {
            enabled: true,
            duration: 0.5,
            easing: 'easeInOut',
            staggerDelay: 0.1
          }
        };
      }
    }, [template, customizations]);

    // Apply dynamic theming
    useEffect(() => {
      try {
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
          
          // Apply background color
          if (finalConfig.colors.background) {
            root.style.setProperty('--template-background', finalConfig.colors.background);
          }
          
          // Apply text colors
          if (finalConfig.colors.text) {
            root.style.setProperty('--template-text', finalConfig.colors.text);
          }
          
          if (finalConfig.colors.textSecondary) {
            root.style.setProperty('--template-text-secondary', finalConfig.colors.textSecondary);
          }
          
          // Apply border color
          if (finalConfig.colors.border) {
            root.style.setProperty('--template-border', finalConfig.colors.border);
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
          
          // Apply font sizes
          if (finalConfig.typography.fontSize) {
            Object.entries(finalConfig.typography.fontSize).forEach(([key, value]) => {
              root.style.setProperty(`--font-size-${key}`, value);
            });
          }
        }
        
        // Apply layout variables
        if (finalConfig.layout) {
          const root = document.documentElement;
          if (finalConfig.layout.maxWidth) {
            root.style.setProperty('--layout-max-width', finalConfig.layout.maxWidth);
          }
          if (finalConfig.layout.padding) {
            root.style.setProperty('--layout-padding', finalConfig.layout.padding);
          }
          if (finalConfig.layout.spacing) {
            root.style.setProperty('--layout-spacing', finalConfig.layout.spacing);
          }
          if (finalConfig.layout.borderRadius) {
            root.style.setProperty('--layout-border-radius', finalConfig.layout.borderRadius);
          }
        }
      } catch (error) {
        console.error('Error applying dynamic theming:', error);
      }
      
      // Cleanup function to remove theme variables when component unmounts
      return () => {
        try {
          const root = document.documentElement;
          root.style.removeProperty('--template-primary-hue');
          root.style.removeProperty('--template-primary-saturation');
          root.style.removeProperty('--template-primary-lightness');
          root.style.removeProperty('--template-secondary-hue');
          root.style.removeProperty('--template-secondary-saturation');
          root.style.removeProperty('--template-secondary-lightness');
          root.style.removeProperty('--template-accent-hue');
          root.style.removeProperty('--template-accent-saturation');
          root.style.removeProperty('--template-accent-lightness');
          root.style.removeProperty('--template-background');
          root.style.removeProperty('--template-text');
          root.style.removeProperty('--template-text-secondary');
          root.style.removeProperty('--template-border');
          root.style.removeProperty('--font-heading');
          root.style.removeProperty('--font-body');
          
          // Remove font size variables
          Object.keys(finalConfig.typography?.fontSize || {}).forEach(key => {
            root.style.removeProperty(`--font-size-${key}`);
          });
          
          // Remove layout variables
          root.style.removeProperty('--layout-max-width');
          root.style.removeProperty('--layout-padding');
          root.style.removeProperty('--layout-spacing');
          root.style.removeProperty('--layout-border-radius');
        } catch (error) {
          console.error('Error cleaning up theme variables:', error);
        }
      };
    }, [finalConfig]);

    // Get ordered sections
    const orderedSections = useMemo(() => {
      try {
        // Ensure we have sections to render
        if (!finalConfig.sections || finalConfig.sections.length === 0) {
          console.warn('No sections found in template config, using default sections');
          // Return default sections to prevent white screen
          const defaultSections: SectionConfig[] = [
            {
              id: 'hero',
              type: 'hero',
              isVisible: true,
              order: 1,
              content: {},
              style: {}
            },
            {
              id: 'story',
              type: 'story',
              isVisible: true,
              order: 2,
              content: {},
              style: {}
            },
            {
              id: 'event-details',
              type: 'event-details',
              isVisible: true,
              order: 3,
              content: {},
              style: {}
            }
          ];
          return defaultSections;
        }
        
        // Filter out hero section if skipHeroSection is true
        let sections = finalConfig.sections;
        if (skipHeroSection) {
          sections = sections.filter(section => section.type !== 'hero');
        }
        
        return sections
          .filter(section => section.isVisible !== false) // Default to visible if not specified
          .sort((a, b) => (a.order || 0) - (b.order || 0)); // Default to order 0 if not specified
      } catch (error) {
        console.error('Error ordering sections:', error);
        // Return default sections to prevent white screen
        const defaultSections: SectionConfig[] = [
          {
            id: 'hero',
            type: 'hero',
            isVisible: true,
            order: 1,
            content: {},
            style: {}
          },
          {
            id: 'story',
            type: 'story',
            isVisible: true,
            order: 2,
            content: {},
            style: {}
          },
          {
            id: 'event-details',
            type: 'event-details',
            isVisible: true,
            order: 3,
            content: {},
            style: {}
          }
        ];
        return defaultSections;
      }
    }, [finalConfig.sections, skipHeroSection]);

    // Check if we have sections to render
    if (!orderedSections || orderedSections.length === 0) {
      console.warn('No sections to display');
      return (
        <div className={`flex items-center justify-center h-64 bg-gray-50 ${className}`}>
          <div className="text-center text-gray-500">
            <p>No sections to display</p>
          </div>
        </div>
      );
    }

    console.log('Rendering sections:', orderedSections);
    
    return (
      <div
        className={`template-theme ${className} w-full max-w-full overflow-x-hidden box-border`}
        style={{
          maxWidth: '100%',
          paddingLeft: '0',
          paddingRight: '0',
          borderRadius: finalConfig.layout?.borderRadius || '0'
        }}
      >
        <div className="max-w-4xl mx-auto w-full box-border">
          {orderedSections.map((section) => (
            <div
              key={section.id || `section-${Math.random()}`} // Fallback key to prevent errors
              className="max-w-full overflow-x-hidden box-border"
              style={{
                marginBottom: finalConfig.layout?.spacing || 'var(--spacing-invitation-md)'
              }}
            >
              {renderSection(section, content, finalConfig, isPreview)}
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in TemplateRenderer:', error);
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 ${className}`}>
        <div className="text-center text-gray-500">
          <p>Error rendering template. Please try again.</p>
        </div>
      </div>
    );
  }
};

// Section renderer function
const renderSection = (
  section: SectionConfig,
  content: InvitationContent,
  config: TemplateConfig,
  isPreview: boolean
) => {
  try {
    // Validate section
    if (!section) {
      console.warn('Invalid section provided to renderSection');
      return null;
    }
    
    switch (section.type) {
      case 'hero':
        console.log('Rendering HeroSection with content:', content.heroSection);
        // Ensure we have content for the hero section
        if (!content.heroSection) {
          console.warn('No hero section content provided, using default');
          content.heroSection = {
            coupleNames: ['Bride', 'Groom']
          };
        }
        return (
          <HeroSection
            config={config}
            isPreview={isPreview}
            sectionConfig={section}
            content={content.heroSection}
            eventDetails={content.eventDetails} // Pass eventDetails for countdown timer
          />
        );
        
      case 'story':
        console.log('Rendering StorySection with content:', content.storySection);
        return content.storySection ? (
          <StorySection
            config={config}
            isPreview={isPreview}
            sectionConfig={section}
            content={content.storySection}
          />
        ) : null;
        
      case 'event-details':
        console.log('Rendering EventDetailsSection with content:', content.eventDetails);
        return content.eventDetails ? (
          <EventDetailsSection
            config={config}
            isPreview={isPreview}
            sectionConfig={section}
            content={content.eventDetails}
          />
        ) : null;
        
      case 'gallery':
        console.log('Rendering GallerySection with content:', content.gallerySection);
        return content.gallerySection ? (
          <GallerySection
            config={config}
            isPreview={isPreview}
            sectionConfig={section}
            content={content.gallerySection}
          />
        ) : null;
        
      case 'map':
        console.log('Rendering MapSection with content:', content.eventDetails);
        return content.eventDetails ? (
          <MapSection
            config={config}
            isPreview={isPreview}
            sectionConfig={section}
            content={content.eventDetails}
          />
        ) : null;
        
      case 'countdown': {
        // Determine which event to use for countdown based on targetEvent setting
        let countdownEvent = null;
        if (content.countdownSection) {
          const targetEvent = content.countdownSection.targetEvent || 'ceremony';
          if (targetEvent === 'ceremony' && content.eventDetails?.ceremony) {
            countdownEvent = content.eventDetails.ceremony;
          } else if (targetEvent === 'reception' && content.eventDetails?.reception) {
            countdownEvent = content.eventDetails.reception;
          } else if (targetEvent === 'custom' && content.countdownSection.customDate) {
            // For custom date, create a synthetic event
            countdownEvent = {
              name: 'Acara Spesial',
              date: content.countdownSection.customDate,
              time: '00:00',
              venue: '',
              address: ''
            };
          }
        }
        
        console.log('Rendering CountdownSection with event:', countdownEvent);
        return countdownEvent ? (
          <CountdownSection
            event={countdownEvent}
            templateConfig={config}
          />
        ) : null;
      }
        
      case 'gift':
        console.log('Rendering GiftSection with content:', content.giftSection);
        return content.giftSection ? (
          <GiftSection
            config={config}
            isPreview={isPreview}
            sectionConfig={section}
            content={content.giftSection}
          />
        ) : null;
        
      case 'closing':
        console.log('Rendering ClosingSection with content:', content.closingSection);
        return content.closingSection ? (
          <ClosingSection
            config={config}
            isPreview={isPreview}
            sectionConfig={section}
            content={content.closingSection}
            heroContent={content.heroSection}
          />
        ) : null;
        
      case 'bride-groom-details':
        console.log('Rendering BrideGroomDetailsSection with content:', content.brideGroomDetailsSection);
        return content.brideGroomDetailsSection ? (
          <BrideGroomDetailsSection
            content={content.brideGroomDetailsSection}
            templateConfig={config}
          />
        ) : null;
        
      case 'sacred-text':
        console.log('Rendering SacredTextSection with content:', content.sacredTextSection);
        return content.sacredTextSection ? (
          <SacredTextSection
            content={content.sacredTextSection}
            templateConfig={config}
          />
        ) : null;
        
      case 'wishes':
        console.log('Rendering WishesSection with content:', content.wishesSection);
        return (
          <WishesSection
            config={config}
            sectionConfig={section}
            isPreview={isPreview}
          />
        );
        
      case 'wishes-messages':
        console.log('Rendering WishesMessagesSection');
        return (
          <WishesMessagesSection
            config={config}
            sectionConfig={section}
            isPreview={isPreview}
          />
        );
        
      // Deprecated sections - mapped to the new unified section
      case 'rsvp':
      case 'guestbook':
        console.log(`Rendering deprecated ${section.type} section as WishesMessagesSection`);
        return (
          <WishesMessagesSection
            config={config}
            sectionConfig={{...section, type: 'wishes-messages'}}
            isPreview={isPreview}
          />
        );
        
      default:
        console.warn('Unknown section type:', section?.type);
        return null;
    }
  } catch (error) {
    console.error(`Error rendering section ${section?.id || 'unknown'}:`, error);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">Error rendering section: {section?.type || 'unknown'}</p>
      </div>
    );
  }
};

// Helper functions
const mergeConfigs = (
  baseConfig: TemplateConfig | undefined,
  customizations: DeepPartial<TemplateConfig>
): TemplateConfig => {
  try {
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
  } catch (error) {
    console.error('Error merging configs:', error);
    // Return a safe default config
    return {
      layout: {
        maxWidth: '100%',
        padding: '1rem',
        spacing: '1rem',
        borderRadius: '0.5rem'
      },
      colors: {
        primary: '#333333',
        secondary: '#666666',
        accent: '#d4af37',
        background: '#ffffff',
        text: '#000000',
        textSecondary: '#666666',
        border: '#e5e5e5'
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        headingFont: 'Playfair Display, serif',
        bodyFont: 'Inter, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        }
      },
      sections: [],
      animations: {
        enabled: true,
        duration: 0.5,
        easing: 'easeInOut',
        staggerDelay: 0.1
      }
    };
  }
};

// Convert legacy section object format to array format
const normalizeSections = (sections: any): SectionConfig[] => {
  try {
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
  } catch (error) {
    console.error('Error normalizing sections:', error);
    return [];
  }
};

const hexToHsl = (hex: string) => {
  try {
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
  } catch (error) {
    console.error('Error converting hex to HSL:', error);
    return { h: 0, s: 0, l: 0 };
  }
};

export default TemplateRenderer;