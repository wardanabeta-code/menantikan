import React, { useState } from 'react';
import { Button } from './ui/button';
import { useInvitationStore } from '../stores/invitationStore';

interface GuestbookFormProps {
  invitationId: string;
}

const GuestbookForm: React.FC<GuestbookFormProps> = ({ invitationId }) => {
  const { addGuestbookEntry, loading } = useInvitationStore();
  
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'name is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await addGuestbookEntry(invitationId, {
        name: formData.name,
        message: formData.message,
        timestamp: new Date()
      });
      
      // Clear form after successful submission
      setFormData({ name: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Failed to submit guestbook entry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="guestbook-name" className="block text-sm font-medium text-gray-700">
          Your Name *
        </label>
        <input
          type="text"
          id="guestbook-name"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
            errors.name ? 'border-red-500' : ''
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="guestbook-message" className="block text-sm font-medium text-gray-700">
          Your Message *
        </label>
        <textarea
          id="guestbook-message"
          rows={4}
          placeholder="Share your wishes and thoughts..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
            errors.message ? 'border-red-500' : ''
          }`}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};

export default GuestbookForm;