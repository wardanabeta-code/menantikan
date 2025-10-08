import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft, Save, Eye, Settings, Palette } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Invitation, InvitationContent } from '@/types';
import EditorForm from '@/components/editor/EditorForm';
import EditorPreview from '@/components/editor/EditorPreview';

interface EditorLayoutProps {
  invitation: Invitation;
  onSave: (content: InvitationContent) => Promise<void>;
  saving: boolean;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({ invitation, onSave, saving }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [formData, setFormData] = useState<Partial<InvitationContent>>({});

  // Initialize formData with default content for missing sections
  useEffect(() => {
    const initializeFormData = () => {
      const content: Partial<InvitationContent> & { settings?: any } = {};
      
      // Always initialize bride-groom details section
      content.brideGroomDetailsSection = {
        title: 'Mempelai',
        bride: {
          fullName: invitation.content?.brideGroomDetailsSection?.bride?.fullName || '',
          nickname: invitation.content?.brideGroomDetailsSection?.bride?.nickname || '',
          instagram: invitation.content?.brideGroomDetailsSection?.bride?.instagram || '',
          childOrder: invitation.content?.brideGroomDetailsSection?.bride?.childOrder || 0,
          fatherName: invitation.content?.brideGroomDetailsSection?.bride?.fatherName || '',
          motherName: invitation.content?.brideGroomDetailsSection?.bride?.motherName || '',
          bio: invitation.content?.brideGroomDetailsSection?.bride?.bio || ''
        },
        groom: {
          fullName: invitation.content?.brideGroomDetailsSection?.groom?.fullName || '',
          nickname: invitation.content?.brideGroomDetailsSection?.groom?.nickname || '',
          instagram: invitation.content?.brideGroomDetailsSection?.groom?.instagram || '',
          childOrder: invitation.content?.brideGroomDetailsSection?.groom?.childOrder || 0,
          fatherName: invitation.content?.brideGroomDetailsSection?.groom?.fatherName || '',
          motherName: invitation.content?.brideGroomDetailsSection?.groom?.motherName || '',
          bio: invitation.content?.brideGroomDetailsSection?.groom?.bio || ''
        }
      };
      
      // Auto-populate hero section based on bride-groom details and event details
      if (content.brideGroomDetailsSection) {
        const brideName = content.brideGroomDetailsSection.bride?.nickname || content.brideGroomDetailsSection.bride?.fullName || '';
        const groomName = content.brideGroomDetailsSection.groom?.nickname || content.brideGroomDetailsSection.groom?.fullName || '';
        
        // Create couple names string
        let coupleNames = '';
        if (brideName && groomName) {
          coupleNames = `${brideName} & ${groomName}`;
        } else if (brideName) {
          coupleNames = brideName;
        } else if (groomName) {
          coupleNames = groomName;
        }
        
        // Initialize or update hero section
        content.heroSection = {
          title: invitation.content?.heroSection?.title || 'Wedding Invitation',
          subtitle: invitation.content?.heroSection?.subtitle || 'We invite you to celebrate with us',
          coupleNames: coupleNames ? [coupleNames] : (invitation.content?.heroSection?.coupleNames || [])
        };
      }
      
      // Auto-populate sacred text section with default Islamic text
      content.sacredTextSection = {
        title: 'Ayat Suci',
        text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu merasa tenang dan tentram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
        source: 'QS. Ar-Rum: 21',
        isIslamic: true
      };
      
      // Auto-populate story section with default content
      content.storySection = {
        title: 'Kisah Cinta Kami',
        timeline: invitation.content?.storySection?.timeline || []
      };
      
      // Auto-populate gallery section with default content
      content.gallerySection = {
        title: 'Perjalanan Kami Bersama',
        images: invitation.content?.gallerySection?.images || [],
        layout: 'grid'
      };
      
      // Auto-populate countdown section based on event details
      content.countdownSection = {
        title: 'Hitung Mundur Acara',
        targetEvent: 'ceremony',
        message: 'Kami menantikan kehadiran Anda di hari istimewa kami'
      };
      
      // Initialize gift section
      content.giftSection = {
        title: 'Amplop Digital & Hadiah',
        subtitle: 'Kehadiran Anda adalah hadiah terbesar bagi kami',
        message: 'Kami sangat bersyukur atas doa dan dukungan Anda. Jika Anda ingin memberikan hadiah, berikut adalah beberapa cara untuk melakukannya:',
        bankAccounts: invitation.content?.giftSection?.bankAccounts || [],
        ewallets: invitation.content?.giftSection?.ewallets || [],
        shippingAddress: {
          recipientName: invitation.content?.giftSection?.shippingAddress?.recipientName || '',
          address: invitation.content?.giftSection?.shippingAddress?.address || '',
          city: invitation.content?.giftSection?.shippingAddress?.city || '',
          postalCode: invitation.content?.giftSection?.shippingAddress?.postalCode || '',
          province: invitation.content?.giftSection?.shippingAddress?.province || '',
          country: invitation.content?.giftSection?.shippingAddress?.country || 'Indonesia',
          phoneNumber: invitation.content?.giftSection?.shippingAddress?.phoneNumber || '',
          notes: invitation.content?.giftSection?.shippingAddress?.notes || ''
        },
        showBankAccounts: invitation.content?.giftSection?.showBankAccounts !== undefined ? invitation.content?.giftSection?.showBankAccounts : true,
        showEwallets: invitation.content?.giftSection?.showEwallets !== undefined ? invitation.content?.giftSection?.showEwallets : true,
        showShippingAddress: invitation.content?.giftSection?.showShippingAddress !== undefined ? invitation.content?.giftSection?.showShippingAddress : true
      };
      
      // Initialize wishes section
      content.wishesSection = {
        title: 'Ucapan & Doa',
        subtitle: 'Kirimi kami doa dan ucapan terbaik untuk hari istimewa kami',
        message: 'Setiap ucapan dan doa dari Anda sangat berarti bagi kami. Terima kasih atas kehadiran dan doa restu Anda.',
        entriesPerPage: invitation.content?.wishesSection?.entriesPerPage || 4,
        showForm: invitation.content?.wishesSection?.showForm !== undefined ? invitation.content?.wishesSection?.showForm : true,
        showEntries: invitation.content?.wishesSection?.showEntries !== undefined ? invitation.content?.wishesSection?.showEntries : true
      };
      
      // Auto-populate closing section with default content
      content.closingSection = {
        title: 'Penutup',
        message: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.',
        gratitudeMessage: 'Terima kasih atas segala doa dan perhatian yang telah diberikan. Kami mohon maaf apabila ada kata-kata maupun perbuatan yang kurang berkenan.',
        includeThankYou: true
      };
      
      // Set event details with both ceremony and reception by default
      content.eventDetails = invitation.content?.eventDetails || {
        ceremony: {
          name: 'Akad Nikah',
          date: new Date(),
          time: '',
          venue: '',
          address: '',
          coordinates: undefined,
          notes: ''
        },
        reception: {
          name: 'Resepsi Pernikahan',
          date: new Date(),
          time: '',
          venue: '',
          address: '',
          coordinates: undefined,
          notes: ''
        }
      };
      
      // Ensure event names are properly set based on defaults
      if (content.eventDetails.ceremony) {
        // If it already has "Pemberkatan" in the name, keep it as Pemberkatan
        if (content.eventDetails.ceremony.name?.toLowerCase().includes('pemberkatan')) {
          content.eventDetails.ceremony.name = 'Pemberkatan';
        } else {
          // Otherwise default to Akad Nikah
          content.eventDetails.ceremony.name = 'Akad Nikah';
        }
      }
      
      if (content.eventDetails.reception) {
        content.eventDetails.reception.name = 'Resepsi Pernikahan';
      }
      
      // Initialize settings from invitation
      content.settings = invitation.settings || {
        isPublic: false,
        requireRSVP: false,
        allowGuestbook: false,
        allowPlusOnes: false
      };
      
      setFormData(content);
    };

    initializeFormData();
  }, [invitation.invitationId, invitation.content, invitation.settings]);

  // Add section visibility management to formData
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({});

  // Initialize section visibility based on template configuration
  useEffect(() => {
    const visibility: Record<string, boolean> = {};
    
    // Get sections from custom theme or template
    const sections = invitation.customTheme?.sections || [];
    
    if (sections && sections.length > 0) {
      sections.forEach(section => {
        visibility[section.id] = section.isVisible !== undefined ? section.isVisible : true;
      });
    } else {
      // Default section visibility if no sections are defined
      visibility['story'] = true;
      visibility['gallery'] = true;
      visibility['countdown'] = true;
      visibility['gift'] = true;
      visibility['wishes'] = true;
    }
    
    setSectionVisibility(visibility);
  }, [invitation.customTheme]);

  // Toggle section visibility
  const toggleSection = (sectionId: string) => {
    // Get current visibility state
    const currentVisibility = isSectionVisible(sectionId);
    const newVisibility = !currentVisibility;
    
    // Update local section visibility state
    setSectionVisibility(prev => ({
      ...prev,
      [sectionId]: newVisibility
    }));
    
    // Update the formData with the new section visibility
    setFormData(prev => {
      // Get current sections from invitation or create default sections
      let currentSections = invitation.customTheme?.sections || [];
      
      // If no sections exist, create default sections
      if (!currentSections || currentSections.length === 0) {
        currentSections = [
          { id: 'story', type: 'story', isVisible: true, order: 1, content: {}, style: {} },
          { id: 'gallery', type: 'gallery', isVisible: true, order: 2, content: {}, style: {} },
          { id: 'countdown', type: 'countdown', isVisible: true, order: 3, content: {}, style: {} },
          { id: 'gift', type: 'gift', isVisible: true, order: 4, content: {}, style: {} },
          { id: 'wishes', type: 'wishes', isVisible: true, order: 5, content: {}, style: {} }
        ];
      }
      
      // Update the specific section's visibility
      const updatedSections = currentSections.map((section: any) => {
        return section.id === sectionId ? { ...section, isVisible: newVisibility } : section;
      });
      
      // If the section doesn't exist in the current sections, add it
      if (!currentSections.some((section: any) => section.id === sectionId)) {
        updatedSections.push({
          id: sectionId,
          type: sectionId,
          isVisible: newVisibility,
          order: updatedSections.length + 1,
          content: {},
          style: {}
        });
      }
      
      // Return updated formData with customTheme
      return {
        ...prev,
        customTheme: {
          ...(prev as any).customTheme || {},
          sections: updatedSections
        }
      };
    });
  };

  // Get section visibility status
  const isSectionVisible = (sectionId: string) => {
    // First check local state
    if (sectionVisibility[sectionId] !== undefined) {
      return sectionVisibility[sectionId];
    }
    
    // If not in local state, check invitation data
    const sections = invitation.customTheme?.sections || [];
    const section = sections.find(s => s.id === sectionId);
    
    // If section exists in invitation data, use its visibility
    if (section) {
      return section.isVisible !== false;
    }
    
    // Default to true for toggleable sections
    return ['story', 'gallery', 'countdown', 'gift', 'wishes'].includes(sectionId);
  };

  // Toggle invitation settings
  const toggleSetting = (setting: keyof Invitation['settings'], value: boolean) => {
    console.log(`=== TOGGLE SETTING ===`);
    console.log(`Setting: ${setting}`);
    console.log(`New Value: ${value}`);
    console.log(`Current formData:`, formData);
    console.log(`Invitation settings:`, invitation.settings);
    
    // Update formData with new settings
    setFormData(prev => {
      // Create updated settings object
      const updatedSettings = {
        ...(invitation.settings || {}),
        ...((prev as any).settings || {}),
        [setting]: value
      };
      
      console.log(`Updated settings:`, updatedSettings);
      
      // Return updated formData with settings
      const updatedFormData = {
        ...prev,
        settings: updatedSettings
      };
      
      console.log(`Updated formData:`, updatedFormData);
      console.log(`=====================`);
      
      return updatedFormData;
    });
  };

  const handleSave = async () => {
    await onSave(formData as InvitationContent);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {(() => {
        console.log('=== DEBUG INFO ===');
        console.log('Invitation:', invitation);
        console.log('FormData:', formData);
        console.log('Invitation settings:', invitation.settings);
        console.log('==================');
        return null;
      })()}
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="text-xl font-bold">Invitation Editor</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/invitation-view/${invitation.templateId}?id=${invitation.invitationId}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-pink-600 hover:bg-pink-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{invitation.title}</h1>
          <p className="text-gray-600">Edit your invitation content</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Palette className="w-4 h-4 inline mr-2" />
              Content
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Settings
            </button>
          </nav>
        </div>

        {/* Content Editor */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <EditorForm 
              formData={formData} 
              setFormData={setFormData} 
              className="lg:col-span-2" 
            />
            <EditorPreview 
              invitation={invitation} 
              formData={formData} 
              className="lg:col-span-1" 
            />
          </div>
        )}

        {/* Settings Editor */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invitation Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">General</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Title</label>
                    <input
                      type="text"
                      value={invitation.title || ''}
                      onChange={(e) => {}}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Wedding of John & Jane"
                    />
                  </div>
                </div>
                
                {/* Section Visibility Toggles */}
                <h3 className="text-md font-medium text-gray-900 mb-3 mt-6">Section Visibility</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Hero Section</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        checked={true}
                        onChange={() => {}}
                        className="sr-only"
                        disabled
                      />
                      <div className={`block w-10 h-6 rounded-full bg-gray-300`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Bride & Groom</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        checked={true}
                        onChange={() => {}}
                        className="sr-only"
                        disabled
                      />
                      <div className={`block w-10 h-6 rounded-full bg-gray-300`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Sacred Text</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        checked={true}
                        onChange={() => {}}
                        className="sr-only"
                        disabled
                      />
                      <div className={`block w-10 h-6 rounded-full bg-gray-300`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Our Story</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none cursor-pointer" onClick={(e) => { e.preventDefault(); toggleSection('story'); }}>
                      <input 
                        type="checkbox" 
                        checked={isSectionVisible('story')}
                        onChange={() => toggleSection('story')}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full ${isSectionVisible('story') ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isSectionVisible('story') ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Event Details</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        checked={true}
                        onChange={() => {}}
                        className="sr-only"
                        disabled
                      />
                      <div className={`block w-10 h-6 rounded-full bg-gray-300`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Gallery</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none cursor-pointer" onClick={(e) => { e.preventDefault(); toggleSection('gallery'); }}>
                      <input 
                        type="checkbox" 
                        checked={isSectionVisible('gallery')}
                        onChange={() => toggleSection('gallery')}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full ${isSectionVisible('gallery') ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isSectionVisible('gallery') ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Countdown</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none cursor-pointer" onClick={(e) => { e.preventDefault(); toggleSection('countdown'); }}>
                      <input 
                        type="checkbox" 
                        checked={isSectionVisible('countdown')}
                        onChange={() => toggleSection('countdown')}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full ${isSectionVisible('countdown') ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isSectionVisible('countdown') ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Gift Information</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none cursor-pointer" onClick={(e) => { e.preventDefault(); toggleSection('gift'); }}>
                      <input 
                        type="checkbox" 
                        checked={isSectionVisible('gift')}
                        onChange={() => toggleSection('gift')}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full ${isSectionVisible('gift') ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isSectionVisible('gift') ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Wishes & Messages</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none cursor-pointer" onClick={(e) => { e.preventDefault(); toggleSection('wishes'); }}>
                      <input 
                        type="checkbox" 
                        checked={isSectionVisible('wishes')}
                        onChange={() => toggleSection('wishes')}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full ${isSectionVisible('wishes') ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isSectionVisible('wishes') ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Closing Message</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        checked={true}
                        onChange={() => {}}
                        className="sr-only"
                        disabled
                      />
                      <div className={`block w-10 h-6 rounded-full bg-gray-300`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4`}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Privacy & Access</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Public Invitation</p>
                      <p className="text-sm text-gray-500">Allow anyone with the link to view</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none cursor-pointer" onClick={(e) => { 
                      e.preventDefault(); 
                      const currentValue = (formData as any).settings?.isPublic !== undefined ? 
                        (formData as any).settings?.isPublic : 
                        (invitation.settings?.isPublic || false);
                      console.log(`Public Invitation - Current value: ${currentValue}, New value: ${!currentValue}`);
                      toggleSetting('isPublic', !currentValue); 
                    }}>
                      <input 
                        type="checkbox" 
                        checked={(formData as any).settings?.isPublic !== undefined ? 
                          (formData as any).settings?.isPublic : 
                          (invitation.settings?.isPublic || false)}
                        onChange={(e) => { 
                          console.log(`Public Invitation - onChange: ${e.target.checked}`);
                          toggleSetting('isPublic', e.target.checked); 
                        }}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full ${
                        ((formData as any).settings?.isPublic !== undefined ? 
                          (formData as any).settings?.isPublic : 
                          (invitation.settings?.isPublic || false)) ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                        ((formData as any).settings?.isPublic !== undefined ? 
                          (formData as any).settings?.isPublic : 
                          (invitation.settings?.isPublic || false)) ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Attendance Confirmation</p>
                      <p className="text-sm text-gray-500">Enable attendance status in Wishes & Messages</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none cursor-pointer" onClick={(e) => { 
                      e.preventDefault(); 
                      const currentValue = (formData as any).settings?.requireRSVP !== undefined ? 
                        (formData as any).settings?.requireRSVP : 
                        (invitation.settings?.requireRSVP || false);
                      console.log(`Attendance Confirmation - Current value: ${currentValue}, New value: ${!currentValue}`);
                      toggleSetting('requireRSVP', !currentValue); 
                    }}>
                      <input 
                        type="checkbox" 
                        checked={(formData as any).settings?.requireRSVP !== undefined ? 
                          (formData as any).settings?.requireRSVP : 
                          (invitation.settings?.requireRSVP || false)}
                        onChange={(e) => { 
                          console.log(`Attendance Confirmation - onChange: ${e.target.checked}`);
                          toggleSetting('requireRSVP', e.target.checked); 
                        }}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full ${
                        ((formData as any).settings?.requireRSVP !== undefined ? 
                          (formData as any).settings?.requireRSVP : 
                          (invitation.settings?.requireRSVP || false)) ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                        ((formData as any).settings?.requireRSVP !== undefined ? 
                          (formData as any).settings?.requireRSVP : 
                          (invitation.settings?.requireRSVP || false)) ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Guest Wishes</p>
                      <p className="text-sm text-gray-500">Allow guests to leave messages in Wishes section</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none cursor-pointer" onClick={(e) => { 
                      e.preventDefault(); 
                      const currentValue = (formData as any).settings?.allowGuestbook !== undefined ? 
                        (formData as any).settings?.allowGuestbook : 
                        (invitation.settings?.allowGuestbook || false);
                      console.log(`Guest Wishes - Current value: ${currentValue}, New value: ${!currentValue}`);
                      toggleSetting('allowGuestbook', !currentValue); 
                    }}>
                      <input 
                        type="checkbox" 
                        checked={(formData as any).settings?.allowGuestbook !== undefined ? 
                          (formData as any).settings?.allowGuestbook : 
                          (invitation.settings?.allowGuestbook || false)}
                        onChange={(e) => { 
                          console.log(`Guest Wishes - onChange: ${e.target.checked}`);
                          toggleSetting('allowGuestbook', e.target.checked); 
                        }}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full ${
                        ((formData as any).settings?.allowGuestbook !== undefined ? 
                          (formData as any).settings?.allowGuestbook : 
                          (invitation.settings?.allowGuestbook || false)) ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                        ((formData as any).settings?.allowGuestbook !== undefined ? 
                          (formData as any).settings?.allowGuestbook : 
                          (invitation.settings?.allowGuestbook || false)) ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Allow Plus Ones</p>
                      <p className="text-sm text-gray-500">Allow guests to indicate companions</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none cursor-pointer" onClick={(e) => { 
                      e.preventDefault(); 
                      const currentValue = (formData as any).settings?.allowPlusOnes !== undefined ? 
                        (formData as any).settings?.allowPlusOnes : 
                        (invitation.settings?.allowPlusOnes || false);
                      console.log(`Allow Plus Ones - Current value: ${currentValue}, New value: ${!currentValue}`);
                      toggleSetting('allowPlusOnes', !currentValue); 
                    }}>
                      <input 
                        type="checkbox" 
                        checked={(formData as any).settings?.allowPlusOnes !== undefined ? 
                          (formData as any).settings?.allowPlusOnes : 
                          (invitation.settings?.allowPlusOnes || false)}
                        onChange={(e) => { 
                          console.log(`Allow Plus Ones - onChange: ${e.target.checked}`);
                          toggleSetting('allowPlusOnes', e.target.checked); 
                        }}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full ${
                        ((formData as any).settings?.allowPlusOnes !== undefined ? 
                          (formData as any).settings?.allowPlusOnes : 
                          (invitation.settings?.allowPlusOnes || false)) ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                        ((formData as any).settings?.allowPlusOnes !== undefined ? 
                          (formData as any).settings?.allowPlusOnes : 
                          (invitation.settings?.allowPlusOnes || false)) ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditorLayout;