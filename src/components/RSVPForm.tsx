import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface RSVPFormProps {
  invitationId: string;
  guestName?: string;
  guestEmail?: string;
}

const RSVPForm: React.FC<RSVPFormProps> = ({ 
  invitationId, 
  guestName = '', 
  guestEmail = '' 
}) => {
  const [formData, setFormData] = useState({
    name: guestName,
    email: guestEmail,
    attending: false,
    dietaryRequirements: '',
    plusOne: false,
    plusOneName: '',
    message: ''
  });

  // Update formData when props change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: guestName,
      email: guestEmail
    }));
  }, [guestName, guestEmail]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'email is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Implementation will be added later
    console.log('RSVP submitted:', { invitationId, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name *
        </label>
        <input
          type="text"
          id="name"
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
            errors.email ? 'border-red-500' : ''
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Will you be attending?
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, attending: true })}
            className={`px-4 py-2 rounded-md ${
              formData.attending ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Attending
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, attending: false })}
            className={`px-4 py-2 rounded-md ${
              !formData.attending ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Not Attending
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="dietary" className="block text-sm font-medium text-gray-700">
          Dietary Requirements
        </label>
        <input
          type="text"
          id="dietary"
          placeholder="Any dietary requirements or allergies"
          value={formData.dietaryRequirements}
          onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.plusOne}
            onChange={(e) => setFormData({ ...formData, plusOne: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">Bringing a plus one</span>
        </label>
      </div>

      {formData.plusOne && (
        <div>
          <label htmlFor="plusOneName" className="block text-sm font-medium text-gray-700">
            Plus One Name
          </label>
          <input
            type="text"
            id="plusOneName"
            placeholder="Plus one name"
            value={formData.plusOneName}
            onChange={(e) => setFormData({ ...formData, plusOneName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message (Optional)
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Leave a message for the couple"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <Button type="submit" className="w-full">
        Submit RSVP
      </Button>
    </form>
  );
};

export default RSVPForm;