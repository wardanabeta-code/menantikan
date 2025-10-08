// Template gallery with preview and selection interface
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Filter, Search, Star, Crown, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { createInvitation } from '../lib/firestore';
import { sampleTemplates, getTemplatesByCategory } from '../data/sampleTemplates';
import type { TemplateCategory, InvitationFormData } from '../types';

const TemplateGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'name'>('popularity');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Listen for messages from preview window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'USE_TEMPLATE') {
        handleTemplateSelect(event.data.templateId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const categories: Array<{ value: TemplateCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Templates' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'graduation', label: 'Graduation' },
    { value: 'baby-shower', label: 'Baby Shower' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'other', label: 'Other' }
  ];

  const filteredTemplates = useMemo(() => {
    let filtered = selectedCategory === 'all' 
      ? sampleTemplates 
      : getTemplatesByCategory(selectedCategory);

    if (searchQuery.trim()) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'popularity') {
        return b.popularity - a.popularity;
      }
      return a.name.localeCompare(b.name);
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleTemplateSelect = async (templateId: string) => {
    // Check if user is authenticated
    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?returnTo=/templates&template=${templateId}`);
      return;
    }

    setIsCreating(true);
    
    try {
      // Create a basic invitation data structure
      const invitationData: InvitationFormData = {
        title: 'New Invitation',
        eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        templateId: templateId,
        heroContent: {
          title: 'Your Special Event',
          subtitle: 'We invite you to celebrate with us'
        },
        eventDetails: {
          ceremony: {
            name: 'Main Event',
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            time: '15:00',
            venue: 'Event Venue',
            address: 'Address to be updated'
          }
        },
        settings: {
          isPublic: false,
          requireRSVP: true,
          allowGuestbook: true,
          allowPlusOnes: true
        }
      };

      // Create the invitation in Firestore
      const invitationId = await createInvitation(user.uid, invitationData);
      
      // Navigate to editor
      navigate(`/editor/${invitationId}`);
    } catch (error) {
      console.error('Error creating invitation:', error);
      alert('Failed to create invitation. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handlePreview = (templateId: string) => {
    // Open template preview in new tab
    window.open(`/template-preview/${templateId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={user ? "/dashboard" : "/"}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {user ? "Dashboard" : "Back"}
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="text-xl font-bold">Menantikan</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user.displayName}</span>
                  <Button onClick={async () => {
                    try {
                      const { signOutUser } = await import('../lib/auth');
                      await signOutUser();
                      navigate('/');
                    } catch (error) {
                      console.error('Error signing out:', error);
                    }
                  }} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {user ? 'Choose Your Template' : 'Choose Your Template'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {user 
              ? 'Select a template to create your invitation and start customizing it'
              : 'Browse our collection of beautiful invitation templates and start creating your perfect invitation'
            }
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as TemplateCategory | 'all')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popularity' | 'name')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="popularity">Most Popular</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
          </p>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.templateId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Template Preview */}
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Placeholder preview */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Heart className="w-12 h-12 mx-auto mb-2 text-pink-500" />
                      <p className="text-sm text-gray-600">Preview</p>
                    </div>
                  </div>
                  
                  {/* Premium Badge */}
                  {template.isPremium && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </div>
                  )}
                  
                  {/* Popularity Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    {template.popularity}
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <span className="text-xs uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handlePreview(template.templateId)}
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      onClick={() => handleTemplateSelect(template.templateId)}
                      disabled={isCreating}
                      className="flex-1 bg-pink-600 hover:bg-pink-700"
                    >
                      {isCreating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        'Use Template'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
              <Search className="h-16 w-16" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No templates found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}

        {/* Premium CTA */}
        {!user && (
          <div className="mt-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Unlock Premium Templates</h2>
            <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
              Sign up to access our premium collection of templates and create stunning invitations for your special events.
            </p>
            <Link to="/signup">
              <Button variant="secondary" size="lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default TemplateGallery;