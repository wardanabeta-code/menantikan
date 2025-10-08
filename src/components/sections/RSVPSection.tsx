// RSVP section component
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, User, Mail, Phone, Users, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import type { TemplateConfig, SectionConfig, RSVPFormData, AttendanceStatus } from '../../types';

interface RSVPSectionProps {
  config: TemplateConfig;
  sectionConfig: SectionConfig;
  isPreview?: boolean;
  onSubmit?: (data: RSVPFormData) => Promise<void>;
}

const RSVPSection: React.FC<RSVPSectionProps> = ({
  config,
  sectionConfig,
  isPreview = false,
  onSubmit
}) => {
  const [formData, setFormData] = useState<RSVPFormData>({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    attendanceStatus: 'attending',
    plusOnes: 0,
    plusOneNames: [],
    dietaryRestrictions: '',
    specialRequests: '',
    message: '',
    events: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: keyof RSVPFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAttendanceChange = (status: AttendanceStatus) => {
    setFormData(prev => ({
      ...prev,
      attendanceStatus: status,
      plusOnes: status === 'attending' ? prev.plusOnes : 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPreview || !onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
            >
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 
              className="text-2xl font-bold mb-4"
              style={{
                color: config.colors?.text || 'var(--color-foreground)',
                fontFamily: config.typography?.headingFont || 'var(--font-heading)'
              }}
            >
              Thank You!
            </h3>
            <p 
              style={{
                color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                fontFamily: config.typography?.bodyFont || 'var(--font-body)'
              }}
            >
              Your RSVP has been submitted successfully. We can't wait to celebrate with you!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              color: config.colors?.text || 'var(--color-foreground)',
              fontFamily: config.typography?.headingFont || 'var(--font-heading)'
            }}
          >
            RSVP
          </h2>
          <p 
            className="text-lg mb-6"
            style={{
              color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
              fontFamily: config.typography?.bodyFont || 'var(--font-body)'
            }}
          >
            Please let us know if you'll be joining us
          </p>
          <div 
            className="w-24 h-px mx-auto"
            style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
          />
        </motion.div>

        {/* RSVP Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Attendance Status */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Will you be attending?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['attending', 'not-attending', 'maybe'] as AttendanceStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleAttendanceChange(status)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      formData.attendanceStatus === status
                        ? 'border-current'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{
                      color: formData.attendanceStatus === status 
                        ? config.colors?.accent || 'var(--color-accent)'
                        : config.colors?.textSecondary || 'var(--color-muted-foreground)',
                      borderColor: formData.attendanceStatus === status 
                        ? config.colors?.accent || 'var(--color-accent)'
                        : undefined
                    }}
                  >
                    {status === 'attending' ? 'Yes' : status === 'not-attending' ? 'No' : 'Maybe'}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="guestName" className="block text-sm font-medium mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Full Name *
                </label>
                <input
                  id="guestName"
                  type="text"
                  required
                  value={formData.guestName}
                  onChange={(e) => handleInputChange('guestName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ 
                    '--tw-ring-color': config.colors?.accent || 'var(--color-accent)' 
                  } as React.CSSProperties}
                />
              </div>
              
              <div>
                <label htmlFor="guestEmail" className="block text-sm font-medium mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  id="guestEmail"
                  type="email"
                  value={formData.guestEmail || ''}
                  onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                />
              </div>
            </div>

            {/* Plus Ones */}
            {formData.attendanceStatus === 'attending' && (
              <div>
                <label htmlFor="plusOnes" className="block text-sm font-medium mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  Number of additional guests
                </label>
                <select
                  id="plusOnes"
                  value={formData.plusOnes}
                  onChange={(e) => handleInputChange('plusOnes', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                >
                  {[0, 1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                <MessageSquare className="inline w-4 h-4 mr-1" />
                Message (optional)
              </label>
              <textarea
                id="message"
                rows={3}
                value={formData.message || ''}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                placeholder="Any special message or note..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || isPreview}
              className="w-full"
              size="lg"
              style={{
                backgroundColor: config.colors?.accent || 'var(--color-accent)',
                color: 'white'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
            </Button>

            {isPreview && (
              <p className="text-center text-sm text-gray-500">
                This is a preview - RSVP submissions are disabled
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default RSVPSection;