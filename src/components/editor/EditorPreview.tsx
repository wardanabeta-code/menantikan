import React, { useState } from 'react';
import type { Invitation, InvitationContent } from '@/types';
import UnifiedPreview from '../UnifiedPreview';

interface EditorPreviewProps {
  invitation: Invitation;
  formData: Partial<InvitationContent>;
  className?: string;
}

const EditorPreview: React.FC<EditorPreviewProps> = ({ invitation, formData, className = '' }) => {
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Validate props
  if (!invitation) {
    return (
      <div className={className}>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-800 p-4 rounded-t-lg">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                <div className="w-24 h-4 bg-gray-700 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
              </div>
            </div>
            <div className="bg-white h-[600px] overflow-y-auto flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p>Invalid invitation data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate dimensions based on preview mode and orientation
  const getPreviewDimensions = () => {
    if (previewMode === 'desktop') {
      return { width: '100%', height: '600px' };
    }
    
    // Mobile mode
    if (orientation === 'portrait') {
      return { width: '375px', height: '667px' };
    } else {
      return { width: '667px', height: '375px' };
    }
  };

  const dimensions = getPreviewDimensions();

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Mobile Preview Panel */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
            
            {/* Preview Controls */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    previewMode === 'mobile' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mobile
                </button>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    previewMode === 'desktop' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Desktop
                </button>
              </div>
              
              {previewMode === 'mobile' && (
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      orientation === 'portrait' 
                        ? 'bg-white shadow-sm text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      orientation === 'landscape' 
                        ? 'bg-white shadow-sm text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {previewMode === 'mobile' ? (
              <>
                {/* Mobile Device Frame */}
                <div className="bg-gray-800 p-4 rounded-t-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                    <div className="w-24 h-4 bg-gray-700 rounded-full"></div>
                    <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
                
                {/* Preview Content with Mobile Simulation */}
                <div 
                  className="bg-white overflow-hidden flex items-center justify-center"
                  style={{ 
                    width: dimensions.width, 
                    height: dimensions.height,
                    margin: '0 auto'
                  }}
                >
                  <div className="w-full h-full overflow-y-auto">
                    <UnifiedPreview 
                      invitation={invitation} 
                      formData={formData} 
                      isEditorPreview={true}
                      className="min-h-full w-full"
                    />
                  </div>
                </div>
                
                {/* Mobile Navigation Bar */}
                <div className="bg-gray-800 p-2 flex justify-center">
                  <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
                </div>
              </>
            ) : (
              // Desktop Preview
              <div 
                className="bg-white overflow-y-auto"
                style={{ height: dimensions.height }}
              >
                <UnifiedPreview 
                  invitation={invitation} 
                  formData={formData} 
                  isEditorPreview={true}
                  className="min-h-full w-full"
                />
              </div>
            )}
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