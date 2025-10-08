// Cloudinary configuration and utilities
import { Cloudinary } from '@cloudinary/url-gen';
import { 
  AdvancedImage, 
  AdvancedVideo, 
  responsive, 
  placeholder 
} from '@cloudinary/react';
import { 
  auto, 
  scale, 
  fit
} from '@cloudinary/url-gen/actions/resize';
import { 
  format, 
  quality 
} from '@cloudinary/url-gen/actions/delivery';
import { validateFile } from './validation';
import type { ValidationResult } from './validation';

// Cloudinary configuration
const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
};

// Initialize Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName: cloudinaryConfig.cloudName
  }
});

// Upload progress callback type
export type UploadProgressCallback = (progress: number) => void;

// Upload result interface
export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
  createdAt: string;
  folder?: string;
  tags?: string[];
}

// Storage paths for Cloudinary folders
export const CloudinaryFolders = {
  INVITATIONS: 'menantikan/invitations',
  TEMPLATES: 'menantikan/templates', 
  USERS: 'menantikan/users',
  GALLERY: 'menantikan/gallery',
  BACKGROUNDS: 'menantikan/backgrounds',
  MUSIC: 'menantikan/music'
} as const;

// File upload options
export interface CloudinaryUploadOptions {
  folder: string;
  publicId?: string;
  tags?: string[];
  transformation?: any;
  onProgress?: UploadProgressCallback;
  maxSize?: number;
  allowedTypes?: string[];
  eager?: any[];
  quality?: string | number;
}

// Upload single file to Cloudinary
export const uploadFile = async (
  file: File,
  options: CloudinaryUploadOptions
): Promise<CloudinaryUploadResult> => {
  // Validate file first
  const validation: ValidationResult = validateFile(file, {
    maxSize: options.maxSize,
    allowedTypes: options.allowedTypes
  });

  if (!validation.isValid) {
    throw new Error(validation.errors.map(e => e.message).join(', '));
  }

  // Check if Cloudinary config is available
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  
  if (options.publicId) {
    formData.append('public_id', options.publicId);
  }
  
  if (options.tags && options.tags.length > 0) {
    formData.append('tags', options.tags.join(','));
  }

  if (options.transformation) {
    formData.append('transformation', JSON.stringify(options.transformation));
  }

  if (options.eager) {
    formData.append('eager', JSON.stringify(options.eager));
  }

  if (options.quality) {
    formData.append('quality', options.quality.toString());
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    
    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      createdAt: result.created_at,
      folder: result.folder,
      tags: result.tags
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (
  files: FileList | File[],
  options: Omit<CloudinaryUploadOptions, 'publicId'> & { 
    generatePublicIds?: (file: File, index: number) => string;
  }
): Promise<CloudinaryUploadResult[]> => {
  const fileArray = Array.from(files);
  const uploads: Promise<CloudinaryUploadResult>[] = [];

  fileArray.forEach((file, index) => {
    const publicId = options.generatePublicIds 
      ? options.generatePublicIds(file, index)
      : undefined;

    uploads.push(
      uploadFile(file, {
        ...options,
        publicId,
        onProgress: options.onProgress 
          ? (progress) => options.onProgress!(progress / fileArray.length + (index * 100) / fileArray.length)
          : undefined
      })
    );
  });

  return Promise.all(uploads);
};

// Delete file from Cloudinary (auto-detect Netlify vs Vercel)
export const deleteFile = async (publicId: string): Promise<void> => {
  if (!cloudinaryConfig.cloudName) {
    throw new Error('Cloudinary configuration is missing.');
  }

  try {
    // Detect deployment environment
    const getApiEndpoint = () => {
      if (typeof window !== 'undefined' && window.location.hostname.includes('netlify')) {
        return '/.netlify/functions';
      }
      if (import.meta.env.VITE_DEPLOY_TARGET === 'netlify') {
        return '/.netlify/functions';
      }
      return '/api';
    };

    // Note: For security, deletion should be handled by backend
    console.warn('File deletion should be handled by backend for security. Public ID:', publicId);
    
    const apiEndpoint = getApiEndpoint();
    const response = await fetch(`${apiEndpoint}/cloudinary`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Generate optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
    crop?: string;
  } = {}
) => {
  const image = cld.image(publicId);
  
  if (options.width && options.height) {
    image.resize(scale().width(options.width).height(options.height));
  }
  
  if (options.quality) {
    image.delivery(quality(options.quality));
  }
  
  image.delivery(format('auto'));

  return image.toURL();
};

// Helper functions for specific use cases

// Upload invitation background image
export const uploadInvitationBackground = async (
  file: File,
  invitationId: string,
  onProgress?: UploadProgressCallback
): Promise<CloudinaryUploadResult> => {
  return uploadFile(file, {
    folder: `${CloudinaryFolders.INVITATIONS}/${invitationId}/backgrounds`,
    tags: ['invitation', 'background', invitationId],
    transformation: {
      quality: 'auto',
      fetch_format: 'auto'
    },
    onProgress,
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
};

// Upload gallery images
export const uploadGalleryImages = async (
  files: FileList | File[],
  invitationId: string,
  onProgress?: UploadProgressCallback
): Promise<CloudinaryUploadResult[]> => {
  return uploadMultipleFiles(files, {
    folder: `${CloudinaryFolders.INVITATIONS}/${invitationId}/gallery`,
    tags: ['invitation', 'gallery', invitationId],
    transformation: {
      quality: 'auto',
      fetch_format: 'auto'
    },
    onProgress,
    maxSize: 5 * 1024 * 1024, // 5MB per image
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    generatePublicIds: (_, index) => `gallery_${invitationId}_${index}_${Date.now()}`
  });
};

// Upload background music
export const uploadBackgroundMusic = async (
  file: File,
  invitationId: string,
  onProgress?: UploadProgressCallback
): Promise<CloudinaryUploadResult> => {
  return uploadFile(file, {
    folder: `${CloudinaryFolders.INVITATIONS}/${invitationId}/music`,
    tags: ['invitation', 'background-music', invitationId],
    onProgress,
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
  });
};

// Upload user profile picture
export const uploadUserProfilePicture = async (
  file: File,
  userId: string,
  onProgress?: UploadProgressCallback
): Promise<CloudinaryUploadResult> => {
  return uploadFile(file, {
    folder: `${CloudinaryFolders.USERS}/${userId}`,
    publicId: 'profile_picture',
    tags: ['user', 'profile-picture', userId],
    transformation: {
      width: 400,
      height: 400,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    },
    onProgress,
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
};

export { AdvancedImage, AdvancedVideo, responsive, placeholder };