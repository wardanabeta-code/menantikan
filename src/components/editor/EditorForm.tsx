import React, { useState } from 'react';
import { Check } from 'lucide-react';
import type { 
  InvitationContent, 
  BrideGroomDetailsContent, 
  EventDetails, 
  GiftContent, 
  WishesContent,
  StoryContent,
  TimelineItem,
  GalleryImage
} from '@/types';
import BrideGroomDetailsForm from '@/components/editor/sections/BrideGroomDetailsForm';
import EventDetailsForm from '@/components/editor/sections/EventDetailsForm';
import GiftSectionForm from '@/components/editor/sections/GiftSectionForm';
import WishesSectionForm from '@/components/editor/sections/WishesSectionForm';
import StorySectionForm from '@/components/editor/sections/StorySectionForm';
import GallerySectionForm from '@/components/editor/sections/GallerySectionForm';

interface EditorFormProps {
  formData: Partial<InvitationContent>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<InvitationContent>>>;
  className?: string;
}

const EditorForm: React.FC<EditorFormProps> = ({ formData, setFormData, className = '' }) => {
  console.log('EditorForm: received formData', formData);
  const [activeTab, setActiveTab] = useState('brideGroom');
  
  // Centralized data update function
  const updateFormData = (section: keyof InvitationContent, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...((prev[section] as any) || {}),
        [field]: value
      }
    }));
  };

  // Specialized update functions for nested structures
  const updateNestedData = (section: keyof InvitationContent, subSection: string, field: string, value: any) => {
    setFormData(prev => {
      const currentSection = (prev[section] as any) || {};
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [subSection]: {
            ...((currentSection as any)[subSection] || {}),
            [field]: value
          }
        }
      };
    });
  };

  // Update array items (for timeline, bank accounts, etc.)
  const updateArrayItem = (section: keyof InvitationContent, arrayName: string, index: number, field: string, value: any) => {
    setFormData(prev => {
      const currentSection = (prev[section] as any) || {};
      const currentArray = (currentSection[arrayName] as any[]) || [];
      const newArray = [...currentArray];
      newArray[index] = { ...newArray[index], [field]: value };
      
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [arrayName]: newArray
        }
      };
    });
  };

  // Add new bank account
  const addBankAccount = () => {
    setFormData(prev => {
      const currentGiftSection = (prev.giftSection as Partial<GiftContent>) || {};
      const currentBankAccounts = currentGiftSection.bankAccounts || [];
      
      const newBankAccount: any = {
        id: Date.now().toString(),
        bankName: '',
        accountNumber: '',
        accountName: ''
      };
      
      return {
        ...prev,
        giftSection: {
          ...currentGiftSection,
          bankAccounts: [...currentBankAccounts, newBankAccount]
        } as GiftContent
      };
    });
  };

  // Remove bank account
  const removeBankAccount = (index: number) => {
    setFormData(prev => {
      const currentGiftSection = (prev.giftSection as Partial<GiftContent>) || {};
      const currentBankAccounts = currentGiftSection.bankAccounts || [];
      const newBankAccounts = [...currentBankAccounts];
      newBankAccounts.splice(index, 1);
      
      return {
        ...prev,
        giftSection: {
          ...currentGiftSection,
          bankAccounts: newBankAccounts
        } as GiftContent
      };
    });
  };

  // Add new e-wallet
  const addEwallet = () => {
    setFormData(prev => {
      const currentGiftSection = (prev.giftSection as Partial<GiftContent>) || {};
      const currentEwallets = currentGiftSection.ewallets || [];
      
      const newEwallet: any = {
        id: Date.now().toString(),
        provider: 'gopay',
        phoneNumber: '',
        accountName: ''
      };
      
      return {
        ...prev,
        giftSection: {
          ...currentGiftSection,
          ewallets: [...currentEwallets, newEwallet]
        } as GiftContent
      };
    });
  };

  // Remove e-wallet
  const removeEwallet = (index: number) => {
    setFormData(prev => {
      const currentGiftSection = (prev.giftSection as Partial<GiftContent>) || {};
      const currentEwallets = currentGiftSection.ewallets || [];
      const newEwallets = [...currentEwallets];
      newEwallets.splice(index, 1);
      
      return {
        ...prev,
        giftSection: {
          ...currentGiftSection,
          ewallets: newEwallets
        } as GiftContent
      };
    });
  };

  // Update bride/groom specific data
  const updateBrideGroomData = (person: 'bride' | 'groom', field: string, value: any) => {
    setFormData(prev => {
      const currentDetails = (prev.brideGroomDetailsSection as Partial<BrideGroomDetailsContent>) || {};
      const currentPerson = (currentDetails[person] as any) || {};
      
      return {
        ...prev,
        brideGroomDetailsSection: {
          ...currentDetails,
          [person]: {
            ...currentPerson,
            [field]: value
          }
        } as BrideGroomDetailsContent
      };
    });
  };

  // Update event details (ceremony/reception)
  const updateEventDetails = (eventType: 'ceremony' | 'reception', field: string, value: any) => {
    setFormData(prev => {
      const currentEventDetails = (prev.eventDetails as Partial<EventDetails>) || {};
      const currentEvent = (currentEventDetails[eventType] as any) || {};
      
      return {
        ...prev,
        eventDetails: {
          ...currentEventDetails,
          [eventType]: {
            ...currentEvent,
            [field]: value
          }
        } as EventDetails
      };
    });
  };

  // Add new timeline item
  const addTimelineItem = () => {
    setFormData(prev => {
      const currentStorySection = (prev.storySection as Partial<StoryContent>) || {};
      const currentTimeline = currentStorySection.timeline || [];
      
      const newTimelineItem: TimelineItem = {
        id: Date.now().toString(),
        date: '',
        title: '',
        description: ''
      };
      
      return {
        ...prev,
        storySection: {
          ...currentStorySection,
          timeline: [...currentTimeline, newTimelineItem]
        } as StoryContent
      };
    });
  };

  // Remove timeline item
  const removeTimelineItem = (index: number) => {
    setFormData(prev => {
      const currentStorySection = (prev.storySection as Partial<StoryContent>) || {};
      const currentTimeline = currentStorySection.timeline || [];
      const newTimeline = [...currentTimeline];
      newTimeline.splice(index, 1);
      
      return {
        ...prev,
        storySection: {
          ...currentStorySection,
          timeline: newTimeline
        } as StoryContent
      };
    });
  };

  // Update gallery images
  const updateGalleryImages = (images: GalleryImage[]) => {
    setFormData(prev => ({
      ...prev,
      gallerySection: {
        ...((prev.gallerySection as any) || {}),
        images
      }
    }));
  };

  // Validation functions for each section
  const isBrideGroomSectionComplete = () => {
    if (!formData.brideGroomDetailsSection) return false;
    
    const bride = formData.brideGroomDetailsSection.bride;
    const groom = formData.brideGroomDetailsSection.groom;
    
    return (
      bride?.fullName && bride?.nickname && 
      groom?.fullName && groom?.nickname
    );
  };

  const isEventDetailsSectionComplete = () => {
    if (!formData.eventDetails) return false;
    
    const ceremony = formData.eventDetails.ceremony;
    const reception = formData.eventDetails.reception;
    
    // At least one event should be defined with required fields
    if (ceremony) {
      return ceremony.name && ceremony.date && ceremony.venue && ceremony.address;
    }
    
    if (reception) {
      return reception.name && reception.date && reception.venue && reception.address;
    }
    
    return false;
  };

  const isStorySectionComplete = () => {
    // Story section is optional
    return true;
  };

  const isGallerySectionComplete = () => {
    // Gallery section is optional
    return true;
  };

  const isGiftSectionComplete = () => {
    if (!formData.giftSection) return true; // Optional section
    
    // If gift section exists, check if at least one payment method is provided
    const hasBankAccount = formData.giftSection.bankAccounts && formData.giftSection.bankAccounts.length > 0;
    const hasEwallet = formData.giftSection.ewallets && formData.giftSection.ewallets.length > 0;
    const hasShippingAddress = formData.giftSection.shippingAddress && 
      formData.giftSection.shippingAddress.recipientName && 
      formData.giftSection.shippingAddress.address;
    
    return hasBankAccount || hasEwallet || hasShippingAddress;
  };

  const isWishesSectionComplete = () => {
    if (!formData.wishesSection) return true; // Optional section
    return true; // Wishes section doesn't have required fields
  };

  // Render active section based on tab
  const renderActiveSection = () => {
    switch (activeTab) {
      case 'brideGroom':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bride & Groom Details</h2>
            {formData.brideGroomDetailsSection ? (
              <BrideGroomDetailsForm 
                data={formData.brideGroomDetailsSection}
                onChange={updateBrideGroomData}
              />
            ) : (
              <div className="text-gray-500">Loading bride and groom details...</div>
            )}
          </div>
        );
      case 'event':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
            <EventDetailsForm 
              data={formData.eventDetails}
              onChange={updateEventDetails}
            />
          </div>
        );
      case 'story':
        return (
          formData.storySection && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Our Story</h2>
              <StorySectionForm 
                data={formData.storySection}
                onChange={(field, value) => updateFormData('storySection', field, value)}
                onTimelineChange={(index, field, value) => updateArrayItem('storySection', 'timeline', index, field, value)}
                onAddTimelineItem={addTimelineItem}
                onRemoveTimelineItem={removeTimelineItem}
              />
            </div>
          )
        );
      case 'gallery':
        return (
          formData.gallerySection && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h2>
              <GallerySectionForm 
                data={formData.gallerySection}
                onChange={(field, value) => updateFormData('gallerySection', field, value)}
                onImagesChange={updateGalleryImages}
              />
            </div>
          )
        );
      case 'gift':
        return (
          formData.giftSection && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gift Information</h2>
              <GiftSectionForm 
                data={formData.giftSection}
                onChange={(field, value) => updateFormData('giftSection', field, value)}
                onBankAccountChange={(index, field, value) => updateArrayItem('giftSection', 'bankAccounts', index, field, value)}
                onEwalletChange={(index, field, value) => updateArrayItem('giftSection', 'ewallets', index, field, value)}
                onShippingAddressChange={(field, value) => updateNestedData('giftSection', 'shippingAddress', field, value)}
                onAddBankAccount={addBankAccount}
                onRemoveBankAccount={removeBankAccount}
                onAddEwallet={addEwallet}
                onRemoveEwallet={removeEwallet}
              />
            </div>
          )
        );
      case 'wishes':
        return (
          formData.wishesSection && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Wishes & Messages</h2>
              <WishesSectionForm 
                data={formData.wishesSection}
                onChange={(field, value) => updateFormData('wishesSection', field, value)}
              />
            </div>
          )
        );
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('brideGroom')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'brideGroom'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Bride & Groom
            {isBrideGroomSectionComplete() && (
              <Check className="w-4 h-4 ml-2 text-green-500" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('event')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'event'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Event Details
            {isEventDetailsSectionComplete() && (
              <Check className="w-4 h-4 ml-2 text-green-500" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('story')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'story'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Our Story
            {isStorySectionComplete() && (
              <Check className="w-4 h-4 ml-2 text-green-500" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'gallery'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Gallery
            {isGallerySectionComplete() && (
              <Check className="w-4 h-4 ml-2 text-green-500" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('gift')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'gift'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Gift Information
            {isGiftSectionComplete() && (
              <Check className="w-4 h-4 ml-2 text-green-500" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('wishes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'wishes'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Wishes & Messages
            {isWishesSectionComplete() && (
              <Check className="w-4 h-4 ml-2 text-green-500" />
            )}
          </button>
        </nav>
      </div>
      
      {/* Active Section Form */}
      {renderActiveSection()}
    </div>
  );
};

export default EditorForm;