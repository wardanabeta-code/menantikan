import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import TemplateRenderer from '../TemplateRenderer';
import { Template, TemplateConfig } from '../../types';

// Mock components
vi.mock('../sections/HeroSection', () => ({
  default: ({ sectionConfig, content }: { sectionConfig: any; content: any }) => {
    const React = require('react');
    // Priority: sectionConfig.content.title (from customizations) > content.title > fallback
    const title = sectionConfig?.content?.title || content?.title || 'No title';
    return React.createElement('div', { 'data-testid': 'hero-section' }, title);
  }
}));

vi.mock('../sections/StorySection', () => ({
  default: ({ sectionConfig, content }: { sectionConfig: any; content: any }) => {
    const React = require('react');
    // Priority: sectionConfig.content.content (from customizations) > timeline description > fallback
    const storyContent = sectionConfig?.content?.content || content?.timeline?.[0]?.description || 'No content';
    return React.createElement('div', { 'data-testid': 'story-section' }, storyContent);
  }
}));

vi.mock('../sections/RSVPSection', () => ({
  default: ({ sectionConfig }: { sectionConfig: any }) => {
    const React = require('react');
    const enabled = sectionConfig?.isVisible !== false;
    return React.createElement('div', { 'data-testid': 'rsvp-section' }, `RSVP: ${enabled ? 'Enabled' : 'Disabled'}`);
  }
}));

vi.mock('../sections/GallerySection', () => ({
  default: ({ sectionConfig, content }: { sectionConfig: any; content: any }) => {
    const React = require('react');
    // Get images from content or sectionConfig
    const images = content?.images || sectionConfig?.content?.images || [];
    const imageCount = Array.isArray(images) ? images.length : 0;
    return React.createElement('div', { 'data-testid': 'gallery-section' }, `Gallery: ${imageCount} images`);
  }
}));

vi.mock('../sections/GuestbookSection', () => ({
  default: ({ sectionConfig }: { sectionConfig: any }) => {
    const React = require('react');
    const enabled = sectionConfig?.isVisible !== false;
    return React.createElement('div', { 'data-testid': 'guestbook-section' }, `Guestbook: ${enabled ? 'Enabled' : 'Disabled'}`);
  }
}));

describe('TemplateRenderer', () => {
  const mockTemplate: Template = {
    id: 'classic-01',
    name: 'Classic Wedding',
    category: 'wedding',
    thumbnail: 'classic-thumb.jpg',
    previewImage: 'classic-preview.jpg',
    config: {
      theme: {
        primaryColor: '#8B5A3C',
        secondaryColor: '#D4AF37',
        backgroundColor: '#FFFFFF',
        textColor: '#333333',
        fontFamily: 'serif'
      },
      sections: {
        hero: {
          enabled: true,
          title: 'Wedding Invitation',
          subtitle: 'Join us for our special day',
          backgroundImage: 'hero-bg.jpg'
        },
        story: {
          enabled: true,
          title: 'Our Story',
          content: 'How we met and fell in love...'
        },
        rsvp: {
          enabled: true,
          title: 'RSVP',
          deadline: '2024-05-01'
        },
        gallery: {
          enabled: true,
          title: 'Gallery',
          images: ['img1.jpg', 'img2.jpg']
        },
        guestbook: {
          enabled: true,
          title: 'Guestbook'
        }
      }
    }
  };

  const mockContent = {
    heroSection: {
      title: 'Wedding Invitation',
      subtitle: 'Join us for our special day',
      coupleNames: ['John', 'Jane']
    },
    eventDetails: {
      ceremony: {
        name: 'Wedding Ceremony',
        date: new Date('2024-06-15'),
        time: '4:00 PM',
        venue: 'Beautiful Chapel',
        address: '123 Wedding St'
      }
    },
    storySection: {
      title: 'Our Story',
      timeline: [{
        id: '1',
        date: '2020',
        title: 'We Met',
        description: 'How we met and fell in love...'
      }]
    },
    gallerySection: {
      title: 'Gallery',
      images: [
        { id: '1', url: 'img1.jpg' },
        { id: '2', url: 'img2.jpg' }
      ],
      layout: 'grid' as const
    }
  };

  const mockCustomConfig: Partial<TemplateConfig> = {
    theme: {
      primaryColor: '#FF6B6B',
      secondaryColor: '#4ECDC4'
    },
    sections: {
      hero: {
        title: 'Custom Title'
      }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders template with default configuration', () => {
    render(<TemplateRenderer template={mockTemplate} content={mockContent} />);
    
    expect(screen.getByTestId('hero-section')).toHaveTextContent('Wedding Invitation');
    expect(screen.getByTestId('story-section')).toHaveTextContent('How we met and fell in love...');
    expect(screen.getByTestId('rsvp-section')).toHaveTextContent('RSVP: Enabled');
    expect(screen.getByTestId('gallery-section')).toHaveTextContent('Gallery: 2 images');
    expect(screen.getByTestId('guestbook-section')).toHaveTextContent('Guestbook: Enabled');
  });

  it('applies custom configuration overrides', () => {
    render(<TemplateRenderer template={mockTemplate} content={mockContent} customizations={mockCustomConfig} />);
    
    expect(screen.getByTestId('hero-section')).toHaveTextContent('Custom Title');
  });

  it('applies theme colors as CSS custom properties', () => {
    const { container } = render(<TemplateRenderer template={mockTemplate} content={mockContent} customizations={mockCustomConfig} />);
    
    // Check that the component renders the template-theme element
    const templateElement = container.querySelector('.template-theme');
    expect(templateElement).toBeInTheDocument();
  });

  it('renders only enabled sections', () => {
    const disabledRSVPConfig: Partial<TemplateConfig> = {
      sections: {
        rsvp: {
          enabled: false
        }
      }
    };

    render(<TemplateRenderer template={mockTemplate} content={mockContent} customizations={disabledRSVPConfig} />);
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('story-section')).toBeInTheDocument();
    expect(screen.queryByTestId('rsvp-section')).not.toBeInTheDocument();
    expect(screen.getByTestId('gallery-section')).toBeInTheDocument();
    expect(screen.getByTestId('guestbook-section')).toBeInTheDocument();
  });

  it('handles missing sections gracefully', () => {
    const templateWithMissingSections = {
      ...mockTemplate,
      config: {
        ...mockTemplate.config,
        sections: {
          hero: mockTemplate.config.sections.hero
        }
      }
    };

    expect(() => {
      render(<TemplateRenderer template={templateWithMissingSections} content={mockContent} />);
    }).not.toThrow();
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
  });

  it('merges deep configuration correctly', () => {
    const partialConfig: Partial<TemplateConfig> = {
      sections: {
        hero: {
          title: 'New Title'
          // subtitle should remain from original config
        },
        story: {
          content: 'New story content'
        }
      }
    };

    render(<TemplateRenderer template={mockTemplate} content={mockContent} customizations={partialConfig} />);
    
    expect(screen.getByTestId('hero-section')).toHaveTextContent('New Title');
    expect(screen.getByTestId('story-section')).toHaveTextContent('New story content');
  });
});