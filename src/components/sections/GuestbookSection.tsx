// Guestbook section component
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, User } from 'lucide-react';
import { Button } from '../ui/button';
import type { TemplateConfig, SectionConfig, GuestbookEntry, GuestbookFormData } from '../../types';

interface GuestbookSectionProps {
  config: TemplateConfig;
  sectionConfig: SectionConfig;
  isPreview?: boolean;
  entries?: GuestbookEntry[];
  onSubmit?: (data: GuestbookFormData) => Promise<void>;
}

const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  config,
  sectionConfig,
  isPreview = false,
  entries = [],
  onSubmit
}) => {
  console.log('GuestbookSection rendering with:', { config, sectionConfig, isPreview, entries });
  
  const [formData, setFormData] = useState<GuestbookFormData>({
    authorName: '',
    authorEmail: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: keyof GuestbookFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPreview || !onSubmit || !formData.authorName.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ authorName: '', authorEmail: '', message: '' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting guestbook entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  // Mock entries for preview
  const displayEntries = isPreview ? [
    {
      entryId: '1',
      invitationId: 'preview',
      authorName: 'Sarah Johnson',
      message: 'Congratulations! Can\'t wait to celebrate with you both. Wishing you a lifetime of love and happiness! ❤️',
      submittedAt: new Date(Date.now() - 86400000), // 1 day ago
      moderationStatus: 'approved' as const
    },
    {
      entryId: '2',
      invitationId: 'preview',
      authorName: 'Mike Chen',
      message: 'So excited for your special day! You two are perfect for each other. Here\'s to many happy years ahead! 🥂',
      submittedAt: new Date(Date.now() - 172800000), // 2 days ago
      moderationStatus: 'approved' as const
    },
    {
      entryId: '3',
      invitationId: 'preview',
      authorName: 'Emily Davis',
      message: 'What wonderful news! I remember when you first started dating and now look at you two. Sending all my love! 💕',
      submittedAt: new Date(Date.now() - 259200000), // 3 days ago
      moderationStatus: 'approved' as const
    }
  ] : entries;

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              color: config.colors?.text || 'var(--color-foreground)',
              fontFamily: config.typography?.headingFont || 'var(--font-heading)'
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Guestbook
          </motion.h2>
          <motion.p 
            className="text-lg mb-6"
            style={{
              color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
              fontFamily: config.typography?.bodyFont || 'var(--font-body)'
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Leave us a message and share in our joy
          </motion.p>
          <motion.div 
            className="w-24 h-px mx-auto"
            style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        </motion.div>

        {/* Guestbook Form */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {submitSuccess && (
            <motion.div
              className="mb-4 p-3 rounded-lg"
              style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-white text-sm font-medium">
                Thank you! Your message has been added to the guestbook.
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div 
              className="grid md:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <label htmlFor="authorName" className="block text-sm font-medium mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Your Name *
                </label>
                <input
                  id="authorName"
                  type="text"
                  required
                  value={formData.authorName}
                  onChange={(e) => handleInputChange('authorName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ 
                    '--tw-ring-color': config.colors?.accent || 'var(--color-accent)' 
                  } as React.CSSProperties}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <label htmlFor="authorEmail" className="block text-sm font-medium mb-2">
                  Email (optional)
                </label>
                <input
                  id="authorEmail"
                  type="email"
                  value={formData.authorEmail || ''}
                  onChange={(e) => handleInputChange('authorEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                <MessageSquare className="inline w-4 h-4 mr-1" />
                Your Message *
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                placeholder="Share your wishes, memories, or congratulations..."
              />
            </motion.div>

            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting || isPreview || !formData.authorName.trim() || !formData.message.trim()}
                className="px-6"
                style={{
                  backgroundColor: config.colors?.accent || 'var(--color-accent)',
                  color: 'white'
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Post Message'}
              </Button>
            </motion.div>

            {isPreview && (
              <motion.p 
                className="text-center text-sm text-gray-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                This is a preview - message submissions are disabled
              </motion.p>
            )}
          </form>
        </motion.div>

        {/* Guestbook Entries */}
        <div className="space-y-6">
          {displayEntries.map((entry, index) => (
            <motion.div
              key={entry.entryId}
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <motion.h4 
                      className="font-semibold"
                      style={{
                        color: config.colors?.text || 'var(--color-foreground)',
                        fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {entry.authorName}
                    </motion.h4>
                    <motion.p 
                      className="text-xs"
                      style={{
                        color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                        fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      {formatDate(entry.submittedAt)}
                    </motion.p>
                  </div>
                </div>
              </div>
              
              <motion.p 
                className="leading-relaxed"
                style={{
                  color: config.colors?.text || 'var(--color-foreground)',
                  fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {entry.message}
              </motion.p>
            </motion.div>
          ))}

          {displayEntries.length === 0 && !isPreview && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <MessageSquare 
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: config.colors?.textSecondary || 'var(--color-muted-foreground)' }}
              />
              <motion.p 
                style={{
                  color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                  fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                Be the first to leave a message!
              </motion.p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GuestbookSection;