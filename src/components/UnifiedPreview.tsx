// Unified preview component for consistent rendering across all preview contexts
import React, { useMemo } from 'react';
import type { Invitation, InvitationContent, TemplateConfig, Template } from '../types';
import TemplateRenderer from './TemplateRenderer';
import { generateSampleContent } from '../utils/sampleContent';

interface UnifiedPreviewProps {
  invitation?: Invitation;
  formData?: Partial<InvitationContent>;
  template?: Template;
  className?: string;
  isEditorPreview?: boolean;
  isTemplatePreview?: boolean;
  skipHeroSection?: boolean; // New prop to skip hero section rendering
}

const UnifiedPreview: React.FC<UnifiedPreviewProps> = ({ 
  invitation, 
  formData,
  template,
  className = '',
  isEditorPreview = false,
  isTemplatePreview = false,
  skipHeroSection = false // Default to false
}) => {
  // Create template config from invitation or template
  const templateConfig: TemplateConfig = useMemo(() => {
    try {
      // Handle the case where we don't have a valid template or invitation
      if (invitation && invitation.customTheme) {
        // For editor preview, merge custom theme with base template config
        return {
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
          sections: Array.isArray(invitation.customTheme?.sections) ? invitation.customTheme?.sections : [],
          animations: {
            enabled: invitation.customTheme?.animations?.enabled !== undefined ? invitation.customTheme?.animations?.enabled : true,
            duration: invitation.customTheme?.animations?.duration || 0.5,
            easing: invitation.customTheme?.animations?.easing || 'easeInOut',
            staggerDelay: invitation.customTheme?.animations?.staggerDelay || 0.1
          }
        };
      } else if (template && template.baseConfig) {
        // For template preview, use template base config
        return template.baseConfig;
      }
      
      // Default config to prevent white screen
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
        sections: [
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
        ],
        animations: {
          enabled: true,
          duration: 0.5,
          easing: 'easeInOut',
          staggerDelay: 0.1
        }
      };
    } catch (error) {
      console.error('Error creating template config:', error);
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
        sections: [
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
        ],
        animations: {
          enabled: true,
          duration: 0.5,
          easing: 'easeInOut',
          staggerDelay: 0.1
        }
      };
    }
  }, [invitation, template]);

  // Create content from formData or sample content
  const content: InvitationContent = useMemo(() => {
    try {
      if (isEditorPreview && formData) {
        // For editor preview, use form data
        return {
          heroSection: {
            coupleNames: formData.brideGroomDetailsSection 
              ? [formData.brideGroomDetailsSection.bride.nickname, formData.brideGroomDetailsSection.groom.nickname]
              : formData.heroSection?.coupleNames || ['Budi', 'Ani']
          },
          storySection: formData.storySection,
          eventDetails: formData.eventDetails || {
            ceremony: {
              name: 'Acara Pernikahan',
              date: new Date(),
              time: '10:00 WIB',
              venue: 'Tempat Acara',
              address: 'Alamat Acara'
            }
          },
          gallerySection: formData.gallerySection,
          giftSection: formData.giftSection,
          closingSection: formData.closingSection,
          brideGroomDetailsSection: formData.brideGroomDetailsSection,
          sacredTextSection: formData.sacredTextSection,
          countdownSection: formData.countdownSection,
          wishesSection: formData.wishesSection
        };
      } else if ((isTemplatePreview || !isEditorPreview) && template) {
        // For template preview, use sample content
        return generateSampleContent(template.templateId);
      } else if (invitation) {
        // For full-screen preview, use invitation content
        return invitation.content;
      }
      
      // Default content to prevent white screen
      return {
        heroSection: {
          coupleNames: ['Budi', 'Ani']
        },
        storySection: {
          timeline: [
            {
              id: '1',
              date: '2020',
              title: 'First Meeting',
              description: 'Our journey began when we first met at a coffee shop.'
            },
            {
              id: '2',
              date: '2022',
              title: 'Engagement',
              description: 'He proposed to me under the stars on a warm summer night.'
            }
          ]
        },
        eventDetails: {
          ceremony: {
            name: 'Akad Nikah',
            date: new Date(),
            time: '10:00 WIB',
            venue: 'Gedung Pernikahan Indah',
            address: 'Jl. Cinta Sejati No. 123, Jakarta Selatan'
          },
          reception: {
            name: 'Resepsi Pernikahan',
            date: new Date(),
            time: '13:00 - 17:00 WIB',
            venue: 'Ballroom Grand Palace',
            address: 'Jl. Resepsi Indah No. 67, Jakarta Selatan'
          }
        }
      };
    } catch (error) {
      console.error('Error creating content:', error);
      // Return safe default content
      return {
        heroSection: {
          coupleNames: ['Budi', 'Ani']
        },
        storySection: {
          timeline: [
            {
              id: '1',
              date: '2020',
              title: 'First Meeting',
              description: 'Our journey began when we first met at a coffee shop.'
            },
            {
              id: '2',
              date: '2022',
              title: 'Engagement',
              description: 'He proposed to me under the stars on a warm summer night.'
            }
          ]
        },
        eventDetails: {
          ceremony: {
            name: 'Akad Nikah',
            date: new Date(),
            time: '10:00 WIB',
            venue: 'Gedung Pernikahan Indah',
            address: 'Jl. Cinta Sejati No. 123, Jakarta Selatan'
          },
          reception: {
            name: 'Resepsi Pernikahan',
            date: new Date(),
            time: '13:00 - 17:00 WIB',
            venue: 'Ballroom Grand Palace',
            address: 'Jl. Resepsi Indah No. 67, Jakarta Selatan'
          }
        }
      };
    }
  }, [formData, invitation, template, isEditorPreview, isTemplatePreview]);

  // Create a temporary template object for TemplateRenderer
  const previewTemplate: Template = useMemo(() => {
    try {
      // Handle the case where we don't have a valid template or invitation
      if (invitation && invitation.templateId) {
        return {
          templateId: invitation.templateId || 'default',
          category: 'wedding',
          name: 'Preview Template',
          description: 'Preview template for invitation editor',
          baseConfig: templateConfig,
          previewImage: '',
          isPremium: false,
          createdBy: invitation.ownerUid || 'system',
          tags: [],
          popularity: 0
        };
      } else if (template && template.templateId) {
        return template;
      }
      
      // Default template to prevent white screen
      return {
        templateId: 'default',
        category: 'wedding',
        name: 'Default Template',
        description: 'Default preview template',
        baseConfig: templateConfig,
        previewImage: '',
        isPremium: false,
        createdBy: 'system',
        tags: [],
        popularity: 0
      };
    } catch (error) {
      console.error('Error creating preview template:', error);
      // Return a safe default template
      return {
        templateId: 'default',
        category: 'wedding',
        name: 'Default Template',
        description: 'Default preview template',
        baseConfig: templateConfig,
        previewImage: '',
        isPremium: false,
        createdBy: 'system',
        tags: [],
        popularity: 0
      };
    }
  }, [invitation, template, templateConfig]);

  // Check if we have valid data to render
  if (!previewTemplate || !content) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 ${className}`}>
        <div className="text-center text-gray-500">
          <p>Loading preview...</p>
        </div>
      </div>
    );
  }

  try {
    // Debug information
    console.log('UnifiedPreview rendering with:', {
      previewTemplate,
      content,
      customizations: invitation?.customTheme,
      isPreview: true
    });
    
    return (
      <div className={`${className} w-full max-w-full box-border`}>
        <TemplateRenderer
          template={previewTemplate}
          content={content}
          customizations={invitation?.customTheme}
          isPreview={true}
          skipHeroSection={skipHeroSection} // Pass the prop to TemplateRenderer
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering template:', error);
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 ${className}`}>
        <div className="text-center text-gray-500">
          <p>Error loading preview. Please try again.</p>
        </div>
      </div>
    );
  }
};

export default UnifiedPreview;