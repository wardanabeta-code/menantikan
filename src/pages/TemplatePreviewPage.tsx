// Template preview page - shows how the template looks to invitation recipients
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ArrowLeft, ExternalLink, Maximize } from 'lucide-react';
import { Button } from '../components/ui/button';
import { getTemplateById } from '../data/sampleTemplates';
import type { Template } from '../types';
import UnifiedPreview from '../components/UnifiedPreview';

const TemplatePreviewPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (templateId) {
      try {
        const foundTemplate = getTemplateById(templateId);
        setTemplate(foundTemplate || null);
      } catch (error) {
        console.error('Error fetching template:', error);
        setTemplate(null);
      }
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
            {template ? (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                {/* Debug Info */}
                <div className="bg-blue-50 p-3 text-xs text-blue-800 border-b hidden md:block">
                  <strong>Debug:</strong> Template ID: {template.templateId}
                </div>
                
                {/* Unified Template Preview */}
                <UnifiedPreview 
                  template={template} 
                  isTemplatePreview={true}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-100">
                <div className="text-center text-gray-500">
                  <p>Loading template...</p>
                </div>
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