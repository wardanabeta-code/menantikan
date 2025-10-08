// Storage integration using Cloudinary (replacing Firebase Storage)
import { 
  uploadFile as cloudinaryUploadFile,
  uploadMultipleFiles as cloudinaryUploadMultipleFiles,
  deleteFile as cloudinaryDeleteFile,
  uploadInvitationBackground as cloudinaryUploadInvitationBackground,
  uploadGalleryImages as cloudinaryUploadGalleryImages,
  uploadBackgroundMusic as cloudinaryUploadBackgroundMusic,
  uploadUserProfilePicture as cloudinaryUploadUserProfilePicture,
  getOptimizedImageUrl,
  CloudinaryFolders
} from './cloudinary';
import type { 
  CloudinaryUploadResult,
  CloudinaryUploadOptions
} from './cloudinary';
import { validateFile } from './validation';
import type { ValidationResult } from './validation';

// Upload progress callback type (kept for compatibility)
export type UploadProgressCallback = (progress: number) => void;

// Upload result interface (adapted for compatibility with existing code)
export interface UploadResult {
  url: string;
  path: string; // Using publicId as path
  metadata: {
    name: string;
    size: number;
    contentType: string;
    timeCreated: string;
  };
}

// Storage paths enum (mapped to Cloudinary folders)
export const StoragePaths = {
  INVITATIONS: 'invitations',
  TEMPLATES: 'templates',
  USERS: 'users',
  GALLERY: 'gallery',
  BACKGROUNDS: 'backgrounds',
  MUSIC: 'music'
} as const;

// File upload options (adapted for Cloudinary)
export interface UploadOptions {
  path: string;
  filename?: string;
  metadata?: Record<string, string>;
  onProgress?: UploadProgressCallback;
  maxSize?: number;
  allowedTypes?: string[];
}

// Convert Cloudinary result to our UploadResult format
const convertCloudinaryResult = (result: CloudinaryUploadResult): UploadResult => {
  return {
    url: result.secureUrl,
    path: result.publicId,
    metadata: {
      name: result.publicId.split('/').pop() || result.publicId,
      size: result.bytes,
      contentType: result.format,
      timeCreated: result.createdAt
    }
  };
};

// Upload single file (main upload function)
export const uploadFile = async (
  file: File,
  options: UploadOptions
): Promise<UploadResult> => {
  // Convert our options to Cloudinary options
  const cloudinaryOptions: CloudinaryUploadOptions = {
    folder: `${CloudinaryFolders.INVITATIONS}/${options.path}`,
    publicId: options.filename,
    tags: options.metadata ? Object.values(options.metadata) : undefined,
    onProgress: options.onProgress,
    maxSize: options.maxSize,
    allowedTypes: options.allowedTypes,
    transformation: {
      quality: 'auto',
      fetch_format: 'auto'
    }
  };

  const result = await cloudinaryUploadFile(file, cloudinaryOptions);
  return convertCloudinaryResult(result);
};

// Upload multiple files
export const uploadMultipleFiles = async (
  files: FileList | File[],
  options: Omit<UploadOptions, 'filename'> & { 
    generateFilenames?: (file: File, index: number) => string;
  }
): Promise<UploadResult[]> => {
  const cloudinaryOptions = {
    folder: `${CloudinaryFolders.INVITATIONS}/${options.path}`,
    tags: options.metadata ? Object.values(options.metadata) : undefined,
    onProgress: options.onProgress,
    maxSize: options.maxSize,
    allowedTypes: options.allowedTypes,
    transformation: {
      quality: 'auto',
      fetch_format: 'auto'
    },
    generatePublicIds: options.generateFilenames
  };

  const results = await cloudinaryUploadMultipleFiles(files, cloudinaryOptions);
  return results.map(convertCloudinaryResult);
};

// Delete file
export const deleteFile = async (path: string): Promise<void> => {
  await cloudinaryDeleteFile(path);
};

// Delete multiple files
export const deleteMultipleFiles = async (paths: string[]): Promise<void> => {
  const deletions = paths.map(path => deleteFile(path));
  await Promise.all(deletions);
};

// Detect deployment environment and API endpoint
const getApiEndpoint = () => {
  // Check if running on Netlify
  if (typeof window !== 'undefined' && window.location.hostname.includes('netlify')) {
    return '/.netlify/functions';
  }
  // Check environment variable for Netlify
  if (import.meta.env.VITE_DEPLOY_TARGET === 'netlify') {
    return '/.netlify/functions';
  }
  // Default to Vercel API routes
  return '/api';
};

// List files in a folder (auto-detect Netlify vs Vercel)
export const listFiles = async (folderPath: string) => {
  try {
    const response = await fetch(`/api/cloudinary?folder=${encodeURIComponent(folderPath)}`);
    
    if (!response.ok) {
      throw new Error('Failed to list files');
    }

    const data = await response.json();
    
    return {
      files: data.resources.map((resource: any) => ({
        name: resource.public_id.split('/').pop(),
        url: resource.secure_url,
        path: resource.public_id,
        size: resource.bytes,
        contentType: resource.format,
        timeCreated: resource.created_at
      })),
      folders: [] // Cloudinary doesn't have explicit folders like Firebase
    };
  } catch (error) {
    console.error('List files error:', error);
    throw new Error(`Failed to list files: ${error}`);
  }
};

// Get file metadata (simplified for Cloudinary)
export const getFileMetadata = async (path: string) => {
  try {
    // For Cloudinary, we can get basic info from the public ID
    // More detailed metadata would require an API call
    const url = getOptimizedImageUrl(path);
    
    return {
      name: path.split('/').pop(),
      downloadURL: url,
      fullPath: path,
      bucket: 'cloudinary',
      generation: Date.now().toString(),
      size: 0, // Would need API call to get actual size
      timeCreated: new Date().toISOString(),
      updated: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to get metadata: ${error}`);
  }
};

// Update file metadata (auto-detect Netlify vs Vercel)
export const updateFileMetadata = async (
  path: string, 
  newMetadata: Record<string, string>
): Promise<void> => {
  try {
    const apiEndpoint = getApiEndpoint();
    console.warn('Metadata update should be handled by backend. Path:', path, 'Metadata:', newMetadata);
    
    const response = await fetch(`${apiEndpoint}/cloudinary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'updateMetadata',
        publicId: path,
        metadata: newMetadata
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update metadata');
    }
  } catch (error) {
    throw new Error(`Failed to update metadata: ${error}`);
  }
};

// Helper functions for specific use cases (using Cloudinary functions)

// Upload invitation background image
export const uploadInvitationBackground = async (
  file: File,
  invitationId: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  const result = await cloudinaryUploadInvitationBackground(file, invitationId, onProgress);
  return convertCloudinaryResult(result);
};

// Upload gallery images
export const uploadGalleryImages = async (
  files: FileList | File[],
  invitationId: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult[]> => {
  const results = await cloudinaryUploadGalleryImages(files, invitationId, onProgress);
  return results.map(convertCloudinaryResult);
};

// Upload background music
export const uploadBackgroundMusic = async (
  file: File,
  invitationId: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  const result = await cloudinaryUploadBackgroundMusic(file, invitationId, onProgress);
  return convertCloudinaryResult(result);
};

// Upload user profile picture
export const uploadUserProfilePicture = async (
  file: File,
  userId: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  const result = await cloudinaryUploadUserProfilePicture(file, userId, onProgress);
  return convertCloudinaryResult(result);
};

// Get invitation media files
export const getInvitationMedia = async (invitationId: string) => {
  try {
    const [backgrounds, gallery, music] = await Promise.all([
      listFiles(`${CloudinaryFolders.INVITATIONS}/${invitationId}/backgrounds`).catch(() => ({ files: [], folders: [] })),
      listFiles(`${CloudinaryFolders.INVITATIONS}/${invitationId}/gallery`).catch(() => ({ files: [], folders: [] })),
      listFiles(`${CloudinaryFolders.INVITATIONS}/${invitationId}/music`).catch(() => ({ files: [], folders: [] }))
    ]);

    return {
      backgrounds: backgrounds.files,
      gallery: gallery.files,
      music: music.files
    };
  } catch (error) {
    console.error('Error getting invitation media:', error);
    return {
      backgrounds: [],
      gallery: [],
      music: []
    };
  }
};

// Utility function to get optimized image URL
export const getOptimizedUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
  } = {}
) => {
  return getOptimizedImageUrl(publicId, options);
};