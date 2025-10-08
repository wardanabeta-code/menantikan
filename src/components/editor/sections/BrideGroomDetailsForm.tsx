import React, { useRef } from 'react';
import { User, Upload, X } from 'lucide-react';
import type { BrideGroomDetailsContent, BrideGroomDetail } from '@/types';

interface BrideGroomDetailsFormProps {
  data?: Partial<BrideGroomDetailsContent>;
  onChange: (person: 'bride' | 'groom', field: string, value: any) => void;
}

const BrideGroomDetailsForm: React.FC<BrideGroomDetailsFormProps> = ({ data, onChange }) => {
  // Refs for file inputs to reset them
  const brideFileInputRef = useRef<HTMLInputElement>(null);
  const groomFileInputRef = useRef<HTMLInputElement>(null);

  const handlePersonChange = (person: 'bride' | 'groom', field: string, value: any) => {
    onChange(person, field, value);
  };

  // Predefined avatars
  const predefinedAvatars = {
    bride: ['👰', '👸', '👩', '👧', '💁‍♀️', '🙋‍♀️'],
    groom: ['🤵', '👨', '👦', '💁‍♂️', '🙋‍♂️', '🧍‍♂️']
  };

  // Handle avatar upload
  const handleAvatarUpload = (person: 'bride' | 'groom', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handlePersonChange(person, 'profileImage', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove avatar
  const removeAvatar = (person: 'bride' | 'groom') => {
    handlePersonChange(person, 'profileImage', '');
    // Reset the file input to allow uploading the same file again
    if (person === 'bride' && brideFileInputRef.current) {
      brideFileInputRef.current.value = '';
    } else if (person === 'groom' && groomFileInputRef.current) {
      groomFileInputRef.current.value = '';
    }
  };

  // Select predefined avatar
  const selectPredefinedAvatar = (person: 'bride' | 'groom', avatar: string) => {
    handlePersonChange(person, 'profileImage', avatar);
    // Reset the file input when selecting a predefined avatar
    if (person === 'bride' && brideFileInputRef.current) {
      brideFileInputRef.current.value = '';
    } else if (person === 'groom' && groomFileInputRef.current) {
      groomFileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <User className="w-5 h-5 mr-2 text-pink-500" />
        Bride & Groom Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bride */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Bride</h3>
          
          {/* Avatar Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            
            {/* Avatar Preview */}
            <div className="flex items-center mb-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-3">
                {data?.bride?.profileImage ? (
                  data.bride.profileImage.startsWith('data:') || data.bride.profileImage.startsWith('http') ? (
                    <img src={data.bride.profileImage} alt="Bride" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{data.bride.profileImage}</span>
                  )
                ) : (
                  <span className="text-2xl">👰</span>
                )}
              </div>
              
              {/* Remove Avatar Button */}
              {data?.bride?.profileImage && (
                <button
                  type="button"
                  onClick={() => removeAvatar('bride')}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Predefined Avatars */}
            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedAvatars.bride.map((avatar, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectPredefinedAvatar('bride', avatar)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 ${
                    data?.bride?.profileImage === avatar 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
            
            {/* Upload Custom Avatar */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAvatarUpload('bride', e)}
                ref={brideFileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="bride-avatar-upload"
              />
              <label
                htmlFor="bride-avatar-upload"
                className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </label>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={data?.bride?.fullName || ''}
                onChange={(e) => handlePersonChange('bride', 'fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Anindya Putri Handayani"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
              <input
                type="text"
                value={data?.bride?.nickname || ''}
                onChange={(e) => handlePersonChange('bride', 'nickname', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Ani"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input
                type="text"
                value={data?.bride?.instagram || ''}
                onChange={(e) => handlePersonChange('bride', 'instagram', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="@anindya_putri"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Child Order</label>
              <input
                type="number"
                value={data?.bride?.childOrder || ''}
                onChange={(e) => handlePersonChange('bride', 'childOrder', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
              <input
                type="text"
                value={data?.bride?.fatherName || ''}
                onChange={(e) => handlePersonChange('bride', 'fatherName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Bapak Suparman"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
              <input
                type="text"
                value={data?.bride?.motherName || ''}
                onChange={(e) => handlePersonChange('bride', 'motherName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Ibu Surtinah"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={data?.bride?.bio || ''}
                onChange={(e) => handlePersonChange('bride', 'bio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Seorang wanita yang ceria, penyayang..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Groom */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Groom</h3>
          
          {/* Avatar Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            
            {/* Avatar Preview */}
            <div className="flex items-center mb-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-3">
                {data?.groom?.profileImage ? (
                  data.groom.profileImage.startsWith('data:') || data.groom.profileImage.startsWith('http') ? (
                    <img src={data.groom.profileImage} alt="Groom" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{data.groom.profileImage}</span>
                  )
                ) : (
                  <span className="text-2xl">🤵</span>
                )}
              </div>
              
              {/* Remove Avatar Button */}
              {data?.groom?.profileImage && (
                <button
                  type="button"
                  onClick={() => removeAvatar('groom')}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Predefined Avatars */}
            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedAvatars.groom.map((avatar, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectPredefinedAvatar('groom', avatar)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 ${
                    data?.groom?.profileImage === avatar 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
            
            {/* Upload Custom Avatar */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAvatarUpload('groom', e)}
                ref={groomFileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="groom-avatar-upload"
              />
              <label
                htmlFor="groom-avatar-upload"
                className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </label>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={data?.groom?.fullName || ''}
                onChange={(e) => handlePersonChange('groom', 'fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Budi Santoso"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
              <input
                type="text"
                value={data?.groom?.nickname || ''}
                onChange={(e) => handlePersonChange('groom', 'nickname', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Budi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input
                type="text"
                value={data?.groom?.instagram || ''}
                onChange={(e) => handlePersonChange('groom', 'instagram', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="@budi_santoso"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Child Order</label>
              <input
                type="number"
                value={data?.groom?.childOrder || ''}
                onChange={(e) => handlePersonChange('groom', 'childOrder', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
              <input
                type="text"
                value={data?.groom?.fatherName || ''}
                onChange={(e) => handlePersonChange('groom', 'fatherName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Bapak Slamet Riyadi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
              <input
                type="text"
                value={data?.groom?.motherName || ''}
                onChange={(e) => handlePersonChange('groom', 'motherName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Ibu Siti Aminah"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={data?.groom?.bio || ''}
                onChange={(e) => handlePersonChange('groom', 'bio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Seorang pria yang bertanggung jawab..."
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrideGroomDetailsForm;