// Sample template data for testing and preview
import type { Template } from '../types';

export const sampleTemplates: Template[] = [
  {
    templateId: 'modern-elegance',
    category: 'wedding',
    name: 'Modern Elegance',
    description: 'Clean and sophisticated design perfect for contemporary weddings',
    baseConfig: {
      layout: {
        maxWidth: '1200px',
        padding: '0rem',
        spacing: '0rem',
        borderRadius: '0.5rem'
      },
      colors: {
        primary: '#db2777',
        secondary: '#6b7280',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#111827',
        textSecondary: '#6b7280',
        border: '#e5e7eb'
      },
      typography: {
        fontFamily: 'Inter',
        headingFont: 'Playfair Display',
        bodyFont: 'Inter',
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
          id: 'sacred-text',
          type: 'sacred-text',
          isVisible: true,
          order: 2,
          content: {},
          style: {}
        },
        {
          id: 'bride-groom-details',
          type: 'bride-groom-details',
          isVisible: true,
          order: 3,
          content: {},
          style: {}
        },
        {
          id: 'story',
          type: 'story',
          isVisible: true,
          order: 4,
          content: {},
          style: {}
        },
        {
          id: 'event-details',
          type: 'event-details',
          isVisible: true,
          order: 5,
          content: {},
          style: {}
        },
        {
          id: 'countdown',
          type: 'countdown',
          isVisible: true,
          order: 6,
          content: {},
          style: {}
        },
        {
          id: 'wishes-messages',
          type: 'wishes-messages',
          isVisible: true,
          order: 7,
          content: {},
          style: {}
        },
        {
          id: 'gift',
          type: 'gift',
          isVisible: true,
          order: 8,
          content: {
            showBankAccounts: true,
            showEwallets: true,
            showShippingAddress: true,
            bankAccounts: [
              {
                id: 'bca-1',
                bankName: 'Bank Central Asia (BCA)',
                accountNumber: '1234567890',
                accountName: 'Mempelai Pria'
              }
            ],
            ewallets: [
              {
                id: 'gopay-1',
                provider: 'GoPay',
                phoneNumber: '081234567890',
                accountName: 'Mempelai Wanita'
              }
            ],
            shippingAddress: {
              recipientName: 'Mempelai Pria & Mempelai Wanita',
              address: 'Jl. Kebahagiaan No. 123, RT 01 RW 02',
              city: 'Jakarta Selatan',
              province: 'DKI Jakarta',
              postalCode: '12345',
              country: 'Indonesia',
              phoneNumber: '081234567890',
              notes: 'Please coordinate delivery time via WhatsApp.'
            }
          },
          style: {}
        },
        {
          id: 'closing',
          type: 'closing',
          isVisible: true,
          order: 9,
          content: {
            includeThankYou: true,
            signatureNames: []
          },
          style: {}
        }
      ],
      animations: {
        enabled: true,
        duration: 300,
        easing: 'easeOut',
        staggerDelay: 100
      }
    },
    previewImage: '/templates/modern-elegance-preview.jpg',
    isPremium: false,
    createdBy: 'system',
    tags: ['modern', 'elegant', 'clean', 'wedding'],
    popularity: 95
  },
  {
    templateId: 'romantic-garden',
    category: 'wedding',
    name: 'Romantic Garden',
    description: 'Soft and dreamy design inspired by blooming gardens',
    baseConfig: {
      layout: {
        maxWidth: '100%',
        padding: '0rem',
        spacing: '0rem',
        borderRadius: '1rem'
      },
      colors: {
        primary: '#ec4899',
        secondary: '#8b5cf6',
        accent: '#10b981',
        background: '#fdf2f8',
        text: '#374151',
        textSecondary: '#6b7280',
        border: '#f3f4f6'
      },
      typography: {
        fontFamily: 'Dancing Script',
        headingFont: 'Dancing Script',
        bodyFont: 'Inter',
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
          id: 'sacred-text',
          type: 'sacred-text',
          isVisible: true,
          order: 2,
          content: {},
          style: {}
        },
        {
          id: 'bride-groom-details',
          type: 'bride-groom-details',
          isVisible: true,
          order: 3,
          content: {},
          style: {}
        },
        {
          id: 'story',
          type: 'story',
          isVisible: true,
          order: 4,
          content: {},
          style: {}
        },
        {
          id: 'event-details',
          type: 'event-details',
          isVisible: true,
          order: 5,
          content: {},
          style: {}
        },
        {
          id: 'gallery',
          type: 'gallery',
          isVisible: true,
          order: 6,
          content: {},
          style: {}
        },
        // Countdown section removed to prevent it from appearing after gallery
        {
          id: 'wishes-messages',
          type: 'wishes-messages',
          isVisible: true,
          order: 7,
          content: {},
          style: {}
        },
        {
          id: 'gift',
          type: 'gift',
          isVisible: true,
          order: 8,
          content: {
            showBankAccounts: true,
            showEwallets: true,
            showShippingAddress: true,
            bankAccounts: [
              {
                id: 'bca-1',
                bankName: 'Bank Central Asia (BCA)',
                accountNumber: '1234567890',
                accountName: 'Mempelai Pria'
              }
            ],
            ewallets: [
              {
                id: 'gopay-1',
                provider: 'GoPay',
                phoneNumber: '081234567890',
                accountName: 'Mempelai Wanita'
              }
            ],
            shippingAddress: {
              recipientName: 'Mempelai Pria & Mempelai Wanita',
              address: 'Jl. Kebahagiaan No. 123, RT 01 RW 02',
              city: 'Jakarta Selatan',
              province: 'DKI Jakarta',
              postalCode: '12345',
              country: 'Indonesia',
              phoneNumber: '081234567890',
              notes: 'Please coordinate delivery time via WhatsApp.'
            }
          },
          style: {}
        },
        {
          id: 'closing',
          type: 'closing',
          isVisible: true,
          order: 9,
          content: {
            includeThankYou: true,
            signatureNames: []
          },
          style: {}
        }
      ],
      animations: {
        enabled: true,
        duration: 500,
        easing: 'easeInOut',
        staggerDelay: 150
      }
    },
    previewImage: '/templates/romantic-garden-preview.jpg',
    isPremium: true,
    createdBy: 'system',
    tags: ['romantic', 'garden', 'floral', 'dreamy', 'wedding'],
    popularity: 88
  },
  {
    templateId: 'birthday-celebration',
    category: 'birthday',
    name: 'Birthday Celebration',
    description: 'Fun and vibrant design perfect for birthday parties',
    baseConfig: {
      layout: {
        maxWidth: '1200px',
        padding: '1.5rem',
        spacing: '2rem',
        borderRadius: '1rem'
      },
      colors: {
        primary: '#f59e0b',
        secondary: '#3b82f6',
        accent: '#ef4444',
        background: '#fffbeb',
        text: '#111827',
        textSecondary: '#6b7280',
        border: '#fed7aa'
      },
      typography: {
        fontFamily: 'Nunito',
        headingFont: 'Nunito',
        bodyFont: 'Nunito',
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
          id: 'event-details',
          type: 'event-details',
          isVisible: true,
          order: 2,
          content: {},
          style: {}
        },
        {
          id: 'countdown',
          type: 'countdown',
          isVisible: true,
          order: 3,
          content: {},
          style: {}
        },
        {
          id: 'wishes-messages',
          type: 'wishes-messages',
          isVisible: true,
          order: 4,
          content: {},
          style: {}
        },
        {
          id: 'gift',
          type: 'gift',
          isVisible: true,
          order: 5,
          content: {
            showBankAccounts: true,
            showEwallets: true,
            showShippingAddress: true,
            bankAccounts: [
              {
                id: 'bca-1',
                bankName: 'Bank Central Asia (BCA)',
                accountNumber: '1234567890',
                accountName: 'Ungkapan Terima Kasih'
              }
            ],
            ewallets: [
              {
                id: 'gopay-1',
                provider: 'GoPay',
                phoneNumber: '081234567890',
                accountName: 'Ungkapan Terima Kasih'
              }
            ],
            shippingAddress: {
              recipientName: 'Ungkapan Terima Kasih',
              address: 'Jl. Kebahagiaan No. 123, RT 01 RW 02',
              city: 'Jakarta Selatan',
              province: 'DKI Jakarta',
              postalCode: '12345',
              country: 'Indonesia',
              phoneNumber: '081234567890',
              notes: 'Please coordinate delivery time via WhatsApp.'
            }
          },
          style: {}
        },
        {
          id: 'closing',
          type: 'closing',
          isVisible: true,
          order: 6,
          content: {
            includeThankYou: true,
            signatureNames: []
          },
          style: {}
        }
      ],
      animations: {
        enabled: true,
        duration: 400,
        easing: 'easeOut',
        staggerDelay: 100
      }
    },
    previewImage: '/templates/birthday-celebration-preview.jpg',
    isPremium: false,
    createdBy: 'system',
    tags: ['birthday', 'party', 'celebration', 'fun', 'colorful'],
    popularity: 76
  },
  {
    templateId: 'corporate-event',
    category: 'corporate',
    name: 'Corporate Professional',
    description: 'Professional and sleek design for corporate events',
    baseConfig: {
      layout: {
        maxWidth: '1200px',
        padding: '2rem',
        spacing: '2.5rem',
        borderRadius: '0.25rem'
      },
      colors: {
        primary: '#1f2937',
        secondary: '#6b7280',
        accent: '#3b82f6',
        background: '#f9fafb',
        text: '#111827',
        textSecondary: '#6b7280',
        border: '#d1d5db'
      },
      typography: {
        fontFamily: 'Inter',
        headingFont: 'Inter',
        bodyFont: 'Inter',
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
          id: 'event-details',
          type: 'event-details',
          isVisible: true,
          order: 2,
          content: {},
          style: {}
        },
        {
          id: 'wishes-messages',
          type: 'wishes-messages',
          isVisible: true,
          order: 3,
          content: {},
          style: {}
        },
        {
          id: 'gift',
          type: 'gift',
          isVisible: true,
          order: 4,
          content: {
            showBankAccounts: true,
            showEwallets: true,
            showShippingAddress: true,
            bankAccounts: [
              {
                id: 'bca-1',
                bankName: 'Bank Central Asia (BCA)',
                accountNumber: '1234567890',
                accountName: 'Acara Perusahaan'
              }
            ],
            ewallets: [
              {
                id: 'gopay-1',
                provider: 'GoPay',
                phoneNumber: '081234567890',
                accountName: 'Acara Perusahaan'
              }
            ],
            shippingAddress: {
              recipientName: 'Acara Perusahaan',
              address: 'Jl. Kebahagiaan No. 123, RT 01 RW 02',
              city: 'Jakarta Selatan',
              province: 'DKI Jakarta',
              postalCode: '12345',
              country: 'Indonesia',
              phoneNumber: '081234567890',
              notes: 'Please coordinate delivery time via WhatsApp.'
            }
          },
          style: {}
        },
        {
          id: 'closing',
          type: 'closing',
          isVisible: true,
          order: 5,
          content: {
            includeThankYou: true,
            signatureNames: []
          },
          style: {}
        }
      ],
      animations: {
        enabled: false,
        duration: 200,
        easing: 'easeOut',
        staggerDelay: 50
      }
    },
    previewImage: '/templates/corporate-event-preview.jpg',
    isPremium: false,
    createdBy: 'system',
    tags: ['corporate', 'professional', 'business', 'minimal'],
    popularity: 65
  },
  {
    templateId: 'classic-wedding',
    category: 'wedding',
    name: 'Classic Wedding',
    description: 'Traditional and timeless wedding invitation design with complete content, animations, and ornamental elements',
    baseConfig: {
      layout: {
        maxWidth: '1200px',
        padding: '2rem',
        spacing: '3rem',
        borderRadius: '0.75rem'
      },
      colors: {
        primary: '#8b4513',
        secondary: '#d4af37',
        accent: '#ffd700',
        background: '#fefefe',
        text: '#2d1810',
        textSecondary: '#8b4513',
        border: '#e5d5c3'
      },
      typography: {
        fontFamily: 'Playfair Display',
        headingFont: 'Playfair Display',
        bodyFont: 'Source Sans Pro',
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
          content: {
            coupleNames: ['Sarah Elizabeth', 'Michael James'],
            backgroundImage: '/images/wedding-hero-bg.jpg'
          },
          style: {
            backgroundColor: '#fefefe',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            textAlign: 'center',
            padding: '6rem 2rem',
            position: 'relative',
            overflow: 'hidden'
          }
        },
        {
          id: 'sacred-text',
          type: 'sacred-text',
          isVisible: true,
          order: 2,
          content: {},
          style: {}
        },
        {
          id: 'bride-groom-details',
          type: 'bride-groom-details',
          isVisible: true,
          order: 3,
          content: {},
          style: {}
        },
        {
          id: 'story',
          type: 'story',
          isVisible: true,
          order: 4,
          content: {
            timeline: [
              {
                id: '1',
                date: 'Spring 2019',
                title: 'First Meeting',
                description: 'We met at a coffee shop near campus. Sarah was reading her favorite book, and Michael couldn\'t help but strike up a conversation about literature.',
                image: '/images/first-meeting.jpg'
              },
              {
                id: '2',
                date: 'Summer 2020',
                title: 'First Date',
                description: 'Our first official date was a picnic in Central Park. We spent hours talking under the stars and knew this was something special.',
                image: '/images/first-date.jpg'
              },
              {
                id: '3',
                date: 'Winter 2022',
                title: 'The Proposal',
                description: 'Michael proposed during a winter evening walk, with the city lights twinkling around us. Sarah said yes immediately!',
                image: '/images/proposal.jpg'
              }
            ]
          },
          style: {
            backgroundColor: '#f9f7f4',
            padding: '3rem 2rem'
          }
        },
        {
          id: 'event-details',
          type: 'event-details',
          isVisible: true,
          order: 5,
          content: {
            ceremony: {
              name: 'Wedding Ceremony',
              date: '2024-06-15T16:00:00',
              time: '4:00 PM',
              venue: 'St. Mary\'s Chapel',
              address: '123 Wedding Lane, Garden City, NY 11530',
              coordinates: {
                lat: 40.7269,
                lng: -73.6345
              },
              dressCode: 'Semi-formal attire',
              notes: 'Please arrive 15 minutes early for seating'
            },
            reception: {
              name: 'Wedding Reception',
              date: '2024-06-15T18:30:00',
              time: '6:30 PM',
              venue: 'Garden Villa Ballroom',
              address: '456 Reception Drive, Garden City, NY 11530',
              coordinates: {
                lat: 40.7289,
                lng: -73.6365
              },
              dressCode: 'Semi-formal attire',
              notes: 'Dinner and dancing to follow. Open bar available.'
            }
          },
          style: {
            backgroundColor: '#ffffff',
            padding: '3rem 2rem'
          }
        },
        {
          id: 'gallery',
          type: 'gallery',
          isVisible: true,
          order: 6,
          content: {
            images: [
              {
                id: '1',
                url: '/images/gallery-1.jpg',
                caption: 'Our first vacation together in Paris',
                thumbnail: '/images/gallery-1-thumb.jpg'
              },
              {
                id: '2',
                url: '/images/gallery-2.jpg',
                caption: 'Celebrating graduation day',
                thumbnail: '/images/gallery-2-thumb.jpg'
              },
              {
                id: '3',
                url: '/images/gallery-3.jpg',
                caption: 'Weekend adventures in the mountains',
                thumbnail: '/images/gallery-3-thumb.jpg'
              },
              {
                id: '4',
                url: '/images/gallery-4.jpg',
                caption: 'Family gathering during holidays',
                thumbnail: '/images/gallery-4-thumb.jpg'
              },
              {
                id: '5',
                url: '/images/gallery-5.jpg',
                caption: 'Dancing under the stars',
                thumbnail: '/images/gallery-5-thumb.jpg'
              },
              {
                id: '6',
                url: '/images/gallery-6.jpg',
                caption: 'Sunset walks on the beach',
                thumbnail: '/images/gallery-6-thumb.jpg'
              }
            ],
            layout: 'masonry'
          },
          style: {
            backgroundColor: '#f9f7f4',
            padding: '3rem 2rem'
          }
        },
        // Countdown section removed to prevent it from appearing after gallery
        {
          id: 'wishes-messages',
          type: 'wishes-messages',
          isVisible: true,
          order: 7,
          content: {},
          style: {
            backgroundColor: '#f9f7f4',
            padding: '3rem 2rem'
          }
        },
        {
          id: 'gift',
          type: 'gift',
          isVisible: true,
          order: 8,
          content: {
            showBankAccounts: true,
            showEwallets: true,
            showShippingAddress: true,
            bankAccounts: [
              {
                id: 'bca-1',
                bankName: 'Bank Central Asia (BCA)',
                accountNumber: '1234567890',
                accountName: 'Sarah Elizabeth'
              },
              {
                id: 'mandiri-1',
                bankName: 'Bank Mandiri',
                accountNumber: '9876543210',
                accountName: 'Michael James'
              }
            ],
            ewallets: [
              {
                id: 'gopay-1',
                provider: 'GoPay',
                phoneNumber: '081234567890',
                accountName: 'Sarah Elizabeth'
              },
              {
                id: 'ovo-1',
                provider: 'OVO',
                phoneNumber: '081298765432',
                accountName: 'Michael James'
              },
              {
                id: 'dana-1',
                provider: 'DANA',
                phoneNumber: '081211112222',
                accountName: 'Sarah Elizabeth'
              }
            ],
            shippingAddress: {
              recipientName: 'Sarah & Michael',
              address: 'Jl. Kebahagiaan No. 123, RT 01 RW 02',
              city: 'Jakarta Selatan',
              province: 'DKI Jakarta',
              postalCode: '12345',
              country: 'Indonesia',
              phoneNumber: '081234567890',
              notes: 'Please coordinate delivery time via WhatsApp. We are usually home in the evenings.'
            }
          },
          style: {
            backgroundColor: '#f9f7f4',
            padding: '3rem 2rem'
          }
        },
        {
          id: 'closing',
          type: 'closing',
          isVisible: true,
          order: 9,
          content: {
            includeThankYou: true,
            signatureNames: ['Sarah Elizabeth', 'Michael James']
          },
          style: {
            backgroundColor: '#8b4513',
            backgroundImage: '/images/closing-bg.jpg',
            padding: '4rem 2rem',
            color: '#ffffff'
          }
        }
      ],
      animations: {
        enabled: true,
        duration: 800,
        easing: 'easeInOut',
        staggerDelay: 300,
        entranceAnimation: 'fadeInUp',
        hoverEffects: true,
        parallaxScrolling: true,
        particleEffects: {
          enabled: true,
          type: 'floating-hearts',
          density: 'medium',
          colors: ['#d4af37', '#ffd700', '#ffffff']
        },
        transitionEffects: {
          sectionTransition: 'smooth-scroll',
          imageTransition: 'zoom-fade',
          textTransition: 'typewriter'
        }
      }
    },
    previewImage: '/templates/classic-wedding-preview.jpg',
    isPremium: false,
    createdBy: 'system',
    tags: ['classic', 'traditional', 'elegant', 'wedding', 'timeless', 'ornamental', 'animated', 'luxury'],
    popularity: 98
  }
];

export const getTemplatesByCategory = (category?: string) => {
  if (!category) return sampleTemplates;
  return sampleTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return sampleTemplates.find(template => template.templateId === id);
};