// Firebase Storage integration for media uploads
import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  getMetadata,
  updateMetadata
} from 'firebase/storage';
import { storage } from './firebase';
import { validateFile } from './validation';
import type { ValidationResult } from './validation';

// Upload progress callback type
export type UploadProgressCallback = (progress: number) => void;

// Upload result interface
export interface UploadResult {
  url: string;
  path: string;
  metadata: {
    name: string;
    size: number;
    contentType: string;
    timeCreated: string;
  };
}

// Storage paths enum
export enum StoragePaths {
  INVITATIONS = 'invitations',
  TEMPLATES = 'templates',
  USERS = 'users',
  GALLERY = 'gallery',
  BACKGROUNDS = 'backgrounds',
  MUSIC = 'music'
}

// File upload options
export interface UploadOptions {
  path: string;
  filename?: string;
  metadata?: Record<string, string>;
  onProgress?: UploadProgressCallback;
  maxSize?: number;
  allowedTypes?: string[];
}

// Generate unique filename
const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.split('.').slice(0, -1).join('.');
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${sanitizedName}_${timestamp}_${randomString}.${extension}`;
};

// Upload single file
export const uploadFile = async (
  file: File,
  options: UploadOptions
): Promise<UploadResult> => {
  // Validate file
  const validation: ValidationResult = validateFile(file, {
    maxSize: options.maxSize,
    allowedTypes: options.allowedTypes
  });

  if (!validation.isValid) {
    throw new Error(validation.errors.map(e => e.message).join(', '));
  }

  // Generate filename
  const filename = options.filename || generateUniqueFilename(file.name);
  const fullPath = `${options.path}/${filename}`;

  // Create storage reference
  const storageRef = ref(storage, fullPath);

  // Prepare metadata
  const metadata = {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      ...options.metadata
    }
  };

  try {
    let uploadTask;
    
    if (options.onProgress) {
      // Use resumable upload with progress tracking
      uploadTask = uploadBytesResumable(storageRef, file, metadata);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            options.onProgress!(progress);
          },
          (error) => {
            reject(new Error(`Upload failed: ${error.message}`));
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const metadata = await getMetadata(uploadTask.snapshot.ref);
              
              resolve({
                url: downloadURL,
                path: fullPath,
                metadata: {
                  name: metadata.name,
                  size: metadata.size,
                  contentType: metadata.contentType || '',
                  timeCreated: metadata.timeCreated
                }
              });
            } catch (error) {
              reject(new Error(`Failed to get download URL: ${error}`));
            }
          }
        );
      });
    } else {
      // Simple upload without progress tracking
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const fileMetadata = await getMetadata(snapshot.ref);
      
      return {
        url: downloadURL,
        path: fullPath,
        metadata: {
          name: fileMetadata.name,
          size: fileMetadata.size,
          contentType: fileMetadata.contentType || '',
          timeCreated: fileMetadata.timeCreated
        }
      };
    }
  } catch (error) {
    throw new Error(`Upload failed: ${error}`);
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (
  files: FileList | File[],
  options: Omit<UploadOptions, 'filename'> & { 
    generateFilenames?: (file: File, index: number) => string;
  }
): Promise<UploadResult[]> => {
  const fileArray = Array.from(files);
  const uploads: Promise<UploadResult>[] = [];

  fileArray.forEach((file, index) => {
    const filename = options.generateFilenames 
      ? options.generateFilenames(file, index)
      : generateUniqueFilename(file.name);

    uploads.push(
      uploadFile(file, {
        ...options,
        filename,
        onProgress: options.onProgress 
          ? (progress) => options.onProgress!(progress / fileArray.length + (index * 100) / fileArray.length)
          : undefined
      })
    );
  });

  return Promise.all(uploads);
};

// Delete file
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    throw new Error(`Delete failed: ${error}`);
  }
};

// Delete multiple files
export const deleteMultipleFiles = async (paths: string[]): Promise<void> => {
  const deletions = paths.map(path => deleteFile(path));
  await Promise.all(deletions);
};

// List files in directory
export const listFiles = async (path: string): Promise<{
  files: Array<{
    name: string;
    path: string;
    size: number;
    contentType: string;
    timeCreated: string;
    downloadURL: string;
  }>;
  folders: string[];
}> => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);

    // Get file details and download URLs
    const filePromises = result.items.map(async (itemRef) => {
      const metadata = await getMetadata(itemRef);
      const downloadURL = await getDownloadURL(itemRef);
      
      return {
        name: metadata.name,
        path: itemRef.fullPath,
        size: metadata.size,
        contentType: metadata.contentType || '',
        timeCreated: metadata.timeCreated,
        downloadURL
      };
    });

    const files = await Promise.all(filePromises);
    const folders = result.prefixes.map(folderRef => folderRef.name);

    return { files, folders };
  } catch (error) {
    throw new Error(`Failed to list files: ${error}`);
  }
};

// Get file metadata
export const getFileMetadata = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const metadata = await getMetadata(storageRef);
    const downloadURL = await getDownloadURL(storageRef);
    
    return {
      ...metadata,
      downloadURL
    };
  } catch (error) {
    throw new Error(`Failed to get metadata: ${error}`);
  }
};

// Update file metadata
export const updateFileMetadata = async (
  path: string, 
  newMetadata: Record<string, string>
): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await updateMetadata(storageRef, {
      customMetadata: newMetadata
    });
  } catch (error) {
    throw new Error(`Failed to update metadata: ${error}`);
  }
};

// Helper functions for specific use cases

// Upload invitation background image
export const uploadInvitationBackground = async (
  file: File,
  invitationId: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  return uploadFile(file, {
    path: `${StoragePaths.INVITATIONS}/${invitationId}/backgrounds`,
    onProgress,
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    metadata: {
      invitationId,
      type: 'background'
    }
  });
};

// Upload gallery images
export const uploadGalleryImages = async (
  files: FileList | File[],
  invitationId: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult[]> => {
  return uploadMultipleFiles(files, {
    path: `${StoragePaths.INVITATIONS}/${invitationId}/gallery`,
    onProgress,
    maxSize: 5 * 1024 * 1024, // 5MB per image
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    metadata: {
      invitationId,
      type: 'gallery'
    }
  });
};

// Upload background music
export const uploadBackgroundMusic = async (
  file: File,
  invitationId: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  return uploadFile(file, {
    path: `${StoragePaths.INVITATIONS}/${invitationId}/music`,
    onProgress,
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
    metadata: {
      invitationId,
      type: 'background-music'
    }
  });
};

// Upload user profile picture
export const uploadUserProfilePicture = async (
  file: File,
  userId: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  return uploadFile(file, {
    path: `${StoragePaths.USERS}/${userId}/profile`,
    filename: 'profile_picture',
    onProgress,
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    metadata: {
      userId,
      type: 'profile-picture'
    }
  });
};

// Get invitation media files
export const getInvitationMedia = async (invitationId: string) => {
  try {
    const [backgrounds, gallery, music] = await Promise.all([
      listFiles(`${StoragePaths.INVITATIONS}/${invitationId}/backgrounds`).catch(() => ({ files: [], folders: [] })),
      listFiles(`${StoragePaths.INVITATIONS}/${invitationId}/gallery`).catch(() => ({ files: [], folders: [] })),
      listFiles(`${StoragePaths.INVITATIONS}/${invitationId}/music`).catch(() => ({ files: [], folders: [] }))
    ]);

    return {
      backgrounds: backgrounds.files,
      gallery: gallery.files,
      music: music.files
    };
  } catch (error) {
    throw new Error(`Failed to get invitation media: ${error}`);
  }
};

// Delete all invitation media
export const deleteInvitationMedia = async (invitationId: string): Promise<void> => {
  try {
    const media = await getInvitationMedia(invitationId);
    const allPaths = [
      ...media.backgrounds.map(f => f.path),
      ...media.gallery.map(f => f.path),
      ...media.music.map(f => f.path)
    ];

    if (allPaths.length > 0) {
      await deleteMultipleFiles(allPaths);
    }
  } catch (error) {
    throw new Error(`Failed to delete invitation media: ${error}`);
  }
};

// Storage utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isImageFile = (contentType: string): boolean => {
  return contentType.startsWith('image/');
};

export const isAudioFile = (contentType: string): boolean => {
  return contentType.startsWith('audio/');
};

export const isVideoFile = (contentType: string): boolean => {
  return contentType.startsWith('video/');
};