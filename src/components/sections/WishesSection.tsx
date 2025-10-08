// Wishes and Attendance Confirmation Section Component
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Heart, User, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import type { TemplateConfig, SectionConfig } from '../../types';

interface WishEntry {
  id: string;
  name: string;
  attendance: 'attending' | 'not-attending' | 'maybe';
  message: string;
  date: Date;
}

interface WishesSectionProps {
  config: TemplateConfig;
  sectionConfig: SectionConfig;
  isPreview?: boolean;
  onSubmit?: (data: any) => Promise<void>;
}

const WishesSection: React.FC<WishesSectionProps> = ({
  config,
  sectionConfig,
  isPreview = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    attendance: 'maybe' as 'attending' | 'not-attending' | 'maybe',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entries, setEntries] = useState<WishEntry[]>([]);
  
  // Mock entries for preview
  const mockEntries: WishEntry[] = [
    {
      id: '1',
      name: 'Budi Santoso',
      attendance: 'attending',
      message: 'Selamat atas pernikahan kalian! Kami akan hadir dengan senang hati dan membawa hadiah spesial. ❤️',
      date: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      name: 'Ani Putri',
      attendance: 'attending',
      message: 'Tidak sabar menunggu hari istimewa kalian! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
      date: new Date(Date.now() - 172800000)
    },
    {
      id: '3',
      name: 'Joko Widodo',
      attendance: 'maybe',
      message: 'Insya Allah akan hadir jika tidak ada kepentingan mendadak. Doakan yang terbaik untuk kami juga ya!',
      date: new Date(Date.now() - 259200000)
    },
    {
      id: '4',
      name: 'Siti Nurhaliza',
      attendance: 'attending',
      message: 'Mazmur 133:1 - "Lihat, betapa baik dan betapa menyenangkan tinggal bersama dengan saudara-saudara!"',
      date: new Date(Date.now() - 345600000)
    },
    {
      id: '5',
      name: 'Raisa Andriana',
      attendance: 'not-attending',
      message: 'Maaf, kami tidak bisa hadir karena ada acara keluarga yang sudah terjadwal. Semoga lancar ya!',
      date: new Date(Date.now() - 432000000)
    },
    {
      id: '6',
      name: 'Isyana Sarasvati',
      attendance: 'attending',
      message: 'Wah, akhirnya! Semoga pernikahan kalian penuh kebahagiaan dan berkah dari Allah SWT.',
      date: new Date(Date.now() - 518400000)
    },
    {
      id: '7',
      name: 'Glenn Fredly',
      attendance: 'maybe',
      message: 'Kami akan berusaha hadir. Terima kasih atas undangannya, semoga acaranya lancar!',
      date: new Date(Date.now() - 604800000)
    },
    {
      id: '8',
      name: 'Tulus',
      attendance: 'attending',
      message: 'Semoga pernikahan kalian menjadi inspirasi bagi kami semua. Kami akan hadir dengan doa terbaik!',
      date: new Date(Date.now() - 691200000)
    }
  ];

  const entriesPerPage = 4;
  const displayEntries = isPreview ? mockEntries : entries;
  const totalPages = Math.ceil(displayEntries.length / entriesPerPage);
  const currentEntries = displayEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPreview || !formData.name.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    try {
      // In a real implementation, this would call an API
      const newEntry: WishEntry = {
        id: Date.now().toString(),
        name: formData.name,
        attendance: formData.attendance,
        message: formData.message,
        date: new Date()
      };
      
      setEntries(prev => [newEntry, ...prev]);
      setFormData({ name: '', attendance: 'maybe', message: '' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting wish:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getAttendanceLabel = (status: string) => {
    switch (status) {
      case 'attending': return 'Hadir';
      case 'not-attending': return 'Tidak Hadir';
      case 'maybe': return 'Belum Tahu';
      default: return status;
    }
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'attending': return 'bg-green-100 text-green-800';
      case 'not-attending': return 'bg-red-100 text-red-800';
      case 'maybe': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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
              color: config.colors?.primary || 'var(--color-foreground)',
              fontFamily: config.typography?.headingFont || 'var(--font-heading)'
            }}
          >
            Ucapan & Doa
          </h2>
          <p 
            className="text-lg mb-6"
            style={{
              color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
              fontFamily: config.typography?.bodyFont || 'var(--font-body)'
            }}
          >
            Kirimkan doa dan ucapan terbaik Anda untuk mempelai
          </p>
          <div 
            className="w-24 h-px mx-auto"
            style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
          />
        </motion.div>

        {/* Wishes Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg p-6 mb-12"
          style={{ 
            border: `1px solid ${config.colors?.border || 'var(--color-border)'}`
          }}
        >
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg flex items-center"
              style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
            >
              <Heart className="w-4 h-4 text-white mr-2" />
              <p className="text-white text-sm font-medium">
                Terima kasih! Ucapan Anda telah berhasil dikirim.
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Nama Lengkap *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                style={{ 
                  '--tw-ring-color': config.colors?.accent || 'var(--color-accent)' 
                } as React.CSSProperties}
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            <div>
              <label htmlFor="attendance" className="block text-sm font-medium mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Konfirmasi Kehadiran *
              </label>
              <select
                id="attendance"
                required
                value={formData.attendance}
                onChange={(e) => handleInputChange('attendance', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                style={{ 
                  '--tw-ring-color': config.colors?.accent || 'var(--color-accent)' 
                } as React.CSSProperties}
              >
                <option value="attending">Hadir</option>
                <option value="not-attending">Tidak Hadir</option>
                <option value="maybe">Belum Tahu</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                <Heart className="inline w-4 h-4 mr-1" />
                Ucapan & Doa *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                placeholder="Tulis ucapan dan doa terbaik Anda untuk mempelai..."
                style={{ 
                  '--tw-ring-color': config.colors?.accent || 'var(--color-accent)' 
                } as React.CSSProperties}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || isPreview || !formData.name.trim() || !formData.message.trim()}
                className="px-8 py-3 rounded-lg font-semibold"
                style={{
                  backgroundColor: config.colors?.primary || 'var(--color-primary)',
                  color: 'white'
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
              </Button>
            </div>

            {isPreview && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Ini adalah pratinjau - pengiriman ucapan dinonaktifkan
              </p>
            )}
          </form>
        </motion.div>

        {/* Wishes Entries */}
        <div className="space-y-6">
          <h3 
            className="text-2xl font-bold mb-6"
            style={{
              color: config.colors?.primary || 'var(--color-foreground)',
              fontFamily: config.typography?.headingFont || 'var(--font-heading)'
            }}
          >
            Ucapan dari Tamu
          </h3>
          
          {currentEntries.length > 0 ? (
            <>
              <div className="space-y-6">
                {currentEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md p-6"
                    style={{ 
                      border: `1px solid ${config.colors?.border || 'var(--color-border)'}`
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: config.colors?.accent || 'var(--color-accent)' }}
                        >
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 
                            className="font-semibold"
                            style={{
                              color: config.colors?.text || 'var(--color-foreground)',
                              fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                            }}
                          >
                            {entry.name}
                          </h4>
                          <p 
                            className="text-xs"
                            style={{
                              color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                              fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                            }}
                          >
                            {formatDate(entry.date)}
                          </p>
                        </div>
                      </div>
                      
                      <span 
                        className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${getAttendanceColor(entry.attendance)}`}
                      >
                        {getAttendanceLabel(entry.attendance)}
                      </span>
                    </div>
                    
                    <p 
                      className="leading-relaxed"
                      style={{
                        color: config.colors?.text || 'var(--color-foreground)',
                        fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                      }}
                    >
                      {entry.message}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex justify-center items-center space-x-2 mt-8"
                >
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                    style={{ 
                      backgroundColor: currentPage === 1 
                        ? 'transparent' 
                        : config.colors?.accent || 'var(--color-accent)',
                      color: currentPage === 1 
                        ? config.colors?.textSecondary || 'var(--color-muted-foreground)' 
                        : 'white'
                    }}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-full text-sm font-medium ${
                        currentPage === i + 1 
                          ? 'text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      style={{ 
                        backgroundColor: currentPage === i + 1 
                          ? config.colors?.primary || 'var(--color-primary)' 
                          : 'transparent'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                    style={{ 
                      backgroundColor: currentPage === totalPages 
                        ? 'transparent' 
                        : config.colors?.accent || 'var(--color-accent)',
                      color: currentPage === totalPages 
                        ? config.colors?.textSecondary || 'var(--color-muted-foreground)' 
                        : 'white'
                    }}
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Heart 
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: config.colors?.textSecondary || 'var(--color-muted-foreground)' }}
              />
              <p 
                style={{
                  color: config.colors?.textSecondary || 'var(--color-muted-foreground)',
                  fontFamily: config.typography?.bodyFont || 'var(--font-body)'
                }}
              >
                Jadilah yang pertama mengirimkan ucapan!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WishesSection;