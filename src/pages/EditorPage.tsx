// Invitation Editor Page
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getInvitation, updateInvitation } from '../lib/firestore';
import type { Invitation, InvitationContent } from '../types';
import EditorLayout from '@/components/editor/EditorLayout';

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load invitation data
  useEffect(() => {
    const loadInvitation = async () => {
      if (!id || !user) return;
      
      try {
        const invitationData = await getInvitation(id);
        console.log('EditorPage: loaded invitation data', invitationData);
        if (invitationData) {
          setInvitation(invitationData);
        }
      } catch (error) {
        console.error('Error loading invitation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, [id, user]);

  // Save changes
  const handleSave = async (data: any) => {
    if (!id || !user || !invitation) return;
    
    setSaving(true);
    try {
      console.log('EditorPage: saving data', data);
      
      // Extract content and settings from the data
      const { settings, ...content } = data;
      
      // Use updated settings if available, otherwise fallback to original settings
      const updatedSettings = settings || invitation.settings;
      
      await updateInvitation(id, {
        content,
        title: invitation.title,
        eventDate: invitation.eventDate,
        templateId: invitation.templateId,
        settings: updatedSettings
      });
      
      // Update local state
      setInvitation(prev => prev ? {
        ...prev,
        content,
        settings: updatedSettings
      } : null);
      
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving invitation:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitation editor...</p>
        </div>
      </div>
    );
  }

  // Render if no invitation found
  if (!invitation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invitation Not Found</h1>
          <p className="text-gray-600 mb-6">The invitation you're trying to edit doesn't exist.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  console.log('EditorPage: rendering with invitation', invitation);
  return (
    <EditorLayout 
      invitation={invitation} 
      onSave={handleSave} 
      saving={saving} 
    />
  );
};

export default EditorPage;