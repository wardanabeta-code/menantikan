import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, MapPin, CreditCard, Smartphone, Copy, Check, QrCode, Phone } from 'lucide-react';
import type { GiftContent, TemplateConfig, SectionConfig } from '../../types';

interface GiftSectionProps {
  content?: GiftContent;
  config: TemplateConfig;
  sectionConfig: SectionConfig;
  isPreview?: boolean;
}

const GiftSection: React.FC<GiftSectionProps> = ({
  content,
  config,
  sectionConfig,
  isPreview = false
}) => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Use content from sectionConfig if available, otherwise use passed content
  const giftContent = sectionConfig.content as GiftContent || content;

  if (!giftContent) {
    return null;
  }

  const copyToClipboard = async (text: string, id: string) => {
    // In preview mode, we'll show a visual feedback without actually copying
    if (isPreview) {
      setCopiedAccount(id);
      setTimeout(() => setCopiedAccount(null), 2000);
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAccount(id);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Even if copying fails, we'll show visual feedback in preview mode
      if (isPreview) {
        setCopiedAccount(id);
        setTimeout(() => setCopiedAccount(null), 2000);
      }
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Section Title with decorative elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-4xl font-bold mb-6 relative z-10"
            style={{
              color: config.colors?.primary || '#333',
              fontFamily: config.typography?.headingFont || 'Playfair Display'
            }}
            viewport={{ once: true }}
          >
            {giftContent.title || 'Amplop Digital & Hadiah'}
          </motion.h2>
          
          {giftContent.subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg mb-8 max-w-2xl mx-auto relative z-10"
              style={{
                color: config.colors?.textSecondary || '#666',
                fontFamily: config.typography?.bodyFont || 'Inter'
              }}
              viewport={{ once: true }}
            >
              {giftContent.subtitle}
            </motion.p>
          )}
          
          {/* Decorative divider */}
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1 mx-auto rounded-full relative z-10"
            style={{ backgroundColor: config.colors?.accent || '#d4af37' }}
            viewport={{ once: true }}
          />
        </motion.div>

        {/* Message */}
        {(giftContent.message || !giftContent.title) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p 
              className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
              style={{
                color: config.colors?.text || '#000000',
                fontFamily: config.typography?.bodyFont || 'Inter'
              }}
            >
              {giftContent.message || 'Kami sangat bersyukur atas doa dan dukungan Anda. Jika Anda ingin memberikan hadiah, berikut adalah beberapa cara untuk melakukannya:'}
            </p>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Bank Accounts with enhanced styling */}
          {giftContent.showBankAccounts && giftContent.bankAccounts && giftContent.bankAccounts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{ 
                backgroundColor: config.colors?.background || '#ffffff',
                boxShadow: `0 10px 25px rgba(0, 0, 0, 0.08), 0 5px 10px rgba(0, 0, 0, 0.04)`,
                border: `1px solid ${config.colors?.accent + '20' || '#f0f0f0'}`
              }}
            >
              {/* Decorative corner elements */}
              <div 
                className="absolute top-0 left-0 w-24 h-24 rounded-br-full opacity-10"
                style={{ 
                  backgroundColor: config.colors?.primary || '#333'
                }}
              />
              <div 
                className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full opacity-10"
                style={{ 
                  backgroundColor: config.colors?.primary || '#333'
                }}
              />
              
              <div className="flex items-center mb-8 relative z-10">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: config.colors?.accent + '20' || '#f0f0f0' }}
                >
                  <CreditCard className="w-7 h-7" style={{ color: config.colors?.accent || '#d4af37' }} />
                </div>
                <h3 
                  className="text-2xl font-bold"
                  style={{
                    color: config.colors?.primary || '#333',
                    fontFamily: config.typography?.headingFont || 'Playfair Display'
                  }}
                >
                  Transfer Bank
                </h3>
              </div>
              
              <div className="space-y-6 relative z-10">
                {giftContent.bankAccounts.map((account, index) => (
                  <motion.div 
                    key={account.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ 
                      x: 8,
                      transition: { duration: 0.2 }
                    }}
                    className="border rounded-xl p-6 cursor-pointer hover:border-gray-300 transition-all duration-200 relative"
                    style={{ borderColor: config.colors?.accent + '30' || '#e0e0e0' }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 
                        className="text-xl font-bold"
                        style={{
                          color: config.colors?.primary || '#333',
                          fontFamily: config.typography?.headingFont || 'Playfair Display'
                        }}
                      >
                        {account.bankName}
                      </h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: config.colors?.accent + '10' || '#f0f0f0' }}>
                        <span 
                          className="text-base font-medium"
                          style={{ color: config.colors?.textSecondary || '#666' }}
                        >
                          Nomor Rekening:
                        </span>
                        <div className="flex items-center space-x-2">
                          <span 
                            className="font-mono text-lg font-bold"
                            style={{ color: config.colors?.text || '#000000' }}
                          >
                            {account.accountNumber}
                          </span>
                          <button
                            onClick={() => copyToClipboard(account.accountNumber, `bank-${account.id}`)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            disabled={isPreview}
                            style={{ backgroundColor: config.colors?.accent + '10' || '#f0f0f0' }}
                          >
                            {copiedAccount === `bank-${account.id}` ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" style={{ color: config.colors?.textSecondary || '#666' }} />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span 
                          className="text-base font-medium"
                          style={{ color: config.colors?.textSecondary || '#666' }}
                        >
                          Atas Nama:
                        </span>
                        <span 
                          className="text-lg font-bold"
                          style={{ color: config.colors?.text || '#000000' }}
                        >
                          {account.accountName}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* E-Wallets with enhanced styling */}
          {giftContent.showEwallets && giftContent.ewallets && giftContent.ewallets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{ 
                backgroundColor: config.colors?.background || '#ffffff',
                boxShadow: `0 10px 25px rgba(0, 0, 0, 0.08), 0 5px 10px rgba(0, 0, 0, 0.04)`,
                border: `1px solid ${config.colors?.accent + '20' || '#f0f0f0'}`
              }}
            >
              {/* Decorative corner elements */}
              <div 
                className="absolute top-0 left-0 w-24 h-24 rounded-br-full opacity-10"
                style={{ 
                  backgroundColor: config.colors?.primary || '#333'
                }}
              />
              <div 
                className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full opacity-10"
                style={{ 
                  backgroundColor: config.colors?.primary || '#333'
                }}
              />
              
              <div className="flex items-center mb-8 relative z-10">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: config.colors?.accent + '20' || '#f0f0f0' }}
                >
                  <Smartphone className="w-7 h-7" style={{ color: config.colors?.accent || '#d4af37' }} />
                </div>
                <h3 
                  className="text-2xl font-bold"
                  style={{
                    color: config.colors?.primary || '#333',
                    fontFamily: config.typography?.headingFont || 'Playfair Display'
                  }}
                >
                  E-Wallet
                </h3>
              </div>
              
              <div className="space-y-6 relative z-10">
                {giftContent.ewallets.map((ewallet, index) => (
                  <motion.div 
                    key={ewallet.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ 
                      x: 8,
                      transition: { duration: 0.2 }
                    }}
                    className="border rounded-xl p-6 cursor-pointer hover:border-gray-300 transition-all duration-200 relative"
                    style={{ borderColor: config.colors?.accent + '30' || '#e0e0e0' }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 
                        className="text-xl font-bold capitalize"
                        style={{
                          color: config.colors?.primary || '#333',
                          fontFamily: config.typography?.headingFont || 'Playfair Display'
                        }}
                      >
                        {ewallet.provider}
                      </h4>
                      {ewallet.qrCodeUrl && (
                        <QrCode className="w-6 h-6" style={{ color: config.colors?.accent || '#d4af37' }} />
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {ewallet.phoneNumber && (
                        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: config.colors?.accent + '10' || '#f0f0f0' }}>
                          <span 
                            className="text-base font-medium"
                            style={{ color: config.colors?.textSecondary || '#666' }}
                          >
                            Nomor HP:
                          </span>
                          <div className="flex items-center space-x-2">
                            <span 
                              className="font-mono text-lg font-bold"
                              style={{ color: config.colors?.text || '#000000' }}
                            >
                              {ewallet.phoneNumber}
                            </span>
                            <button
                              onClick={() => copyToClipboard(ewallet.phoneNumber!, `ewallet-${ewallet.id}`)}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                              disabled={isPreview}
                              style={{ backgroundColor: config.colors?.accent + '10' || '#f0f0f0' }}
                            >
                              {copiedAccount === `ewallet-${ewallet.id}` ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" style={{ color: config.colors?.textSecondary || '#666' }} />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span 
                          className="text-base font-medium"
                          style={{ color: config.colors?.textSecondary || '#666' }}
                        >
                          Atas Nama:
                        </span>
                        <span 
                          className="text-lg font-bold"
                          style={{ color: config.colors?.text || '#000000' }}
                        >
                          {ewallet.accountName}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Shipping Address with enhanced styling */}
        {giftContent.showShippingAddress && giftContent.shippingAddress && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.3 }
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="mt-12 rounded-2xl p-8 relative overflow-hidden"
            style={{ 
              backgroundColor: config.colors?.background || '#ffffff',
              boxShadow: `0 10px 25px rgba(0, 0, 0, 0.08), 0 5px 10px rgba(0, 0, 0, 0.04)`,
              border: `1px solid ${config.colors?.accent + '20' || '#f0f0f0'}`
            }}
          >
            {/* Decorative corner elements */}
            <div 
              className="absolute top-0 left-0 w-24 h-24 rounded-br-full opacity-10"
              style={{ 
                backgroundColor: config.colors?.primary || '#333'
              }}
            />
            <div 
              className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full opacity-10"
              style={{ 
                backgroundColor: config.colors?.primary || '#333'
              }}
            />
            
            <div className="flex items-center mb-8 relative z-10">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mr-4"
                style={{ backgroundColor: config.colors?.accent + '20' || '#f0f0f0' }}
              >
                <MapPin className="w-7 h-7" style={{ color: config.colors?.accent || '#d4af37' }} />
              </div>
              <h3 
                className="text-2xl font-bold"
                style={{
                  color: config.colors?.primary || '#333',
                  fontFamily: config.typography?.headingFont || 'Playfair Display'
                }}
              >
                Alamat Pengiriman Hadiah
              </h3>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 relative z-10" style={{ backgroundColor: config.colors?.accent + '05' || '#f9f9f9' }}>
              <div className="space-y-5">
                <div>
                  <span 
                    className="text-xl font-bold"
                    style={{ color: config.colors?.primary || '#333' }}
                  >
                    {giftContent.shippingAddress.recipientName}
                  </span>
                  {giftContent.shippingAddress.phoneNumber && (
                    <div className="flex items-center mt-2">
                      <Phone className="w-5 h-5 mr-3" style={{ color: config.colors?.textSecondary || '#666' }} />
                      <span 
                        className="text-base"
                        style={{ color: config.colors?.text || '#000000' }}
                      >
                        {giftContent.shippingAddress.phoneNumber}
                      </span>
                    </div>
                  )}
                </div>
                
                <div 
                  className="text-base leading-relaxed"
                  style={{ color: config.colors?.text || '#000000' }}
                >
                  {giftContent.shippingAddress.address}<br />
                  {giftContent.shippingAddress.city}, {giftContent.shippingAddress.province} {giftContent.shippingAddress.postalCode}<br />
                  {giftContent.shippingAddress.country}
                </div>
                
                {giftContent.shippingAddress.notes && (
                  <div 
                    className="text-sm mt-4 p-4 rounded-lg"
                    style={{ 
                      backgroundColor: config.colors?.accent + '10' || '#f0f0f0',
                      color: config.colors?.textSecondary || '#666'
                    }}
                  >
                    <strong>Catatan:</strong> {giftContent.shippingAddress.notes}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    const fullAddress = `${giftContent.shippingAddress!.recipientName}
${giftContent.shippingAddress!.address}
${giftContent.shippingAddress!.city}, ${giftContent.shippingAddress!.province} ${giftContent.shippingAddress!.postalCode}
${giftContent.shippingAddress!.country}${giftContent.shippingAddress!.phoneNumber ? `
${giftContent.shippingAddress!.phoneNumber}` : ''}`;
                    copyToClipboard(fullAddress, 'address');
                  }}
                  className="flex items-center px-5 py-3 rounded-xl border transition-all duration-200 hover:shadow-md"
                  disabled={isPreview}
                  style={{ 
                    backgroundColor: config.colors?.background || '#ffffff',
                    borderColor: config.colors?.accent + '30' || '#e0e0e0',
                    color: config.colors?.text || '#000000'
                  }}
                >
                  {copiedAccount === 'address' ? (
                    <Check className="w-5 h-5 mr-2 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 mr-2" style={{ color: config.colors?.textSecondary || '#666' }} />
                  )}
                  <span 
                    className="text-base font-medium"
                  >
                    Salin Alamat
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default GiftSection;