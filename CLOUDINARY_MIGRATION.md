# Migration Guide: Firebase Storage + Functions → Cloudinary + Vercel Functions

This document explains the migration from Firebase Storage and Functions to Cloudinary and Vercel Functions to avoid Firebase plan upgrades.

## What Changed

### 🔄 Replaced Services
- **Firebase Storage** → **Cloudinary** (for file uploads/storage)
- **Firebase Functions** → **Vercel Functions** (for backend operations)
- **Firebase Auth + Firestore** → **Still using Firebase** (free tier sufficient)

### 📂 File Changes
- `src/lib/firebase.ts` - Removed storage and functions imports
- `src/lib/storage.ts` - Completely rewritten to use Cloudinary
- `src/lib/cloudinary.ts` - New Cloudinary configuration and utilities
- `api/cloudinary/index.ts` - New Vercel Function for secure operations
- `src/lib/storage-firebase-backup.ts` - Backup of original Firebase Storage code

## Setup Instructions

### 1. Cloudinary Setup

1. **Create Cloudinary Account**: https://cloudinary.com/
2. **Get Configuration Values**:
   - Go to Cloudinary Console > Dashboard
   - Copy Cloud Name, API Key
3. **Create Upload Preset**:
   - Go to Settings > Upload > Upload presets
   - Create a new unsigned preset
   - Set folder to `menantikan` (or your preference)
   - Enable auto-tagging if desired

### 2. Environment Variables

Update your `.env.local` file with Cloudinary credentials:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
```

### 3. Vercel Deployment Setup

For production deployment, add these environment variables in Vercel Dashboard:

```env
# Frontend (same as .env.local)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset

# Backend (for Vercel Functions)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## API Changes

### Upload Functions

The upload functions maintain the same interface but now use Cloudinary:

```typescript
// Before (Firebase Storage)
import { uploadFile } from './lib/storage';

// After (Cloudinary) - same interface!
import { uploadFile } from './lib/storage';

// Usage remains the same
const result = await uploadFile(file, {
  path: 'invitations/123',
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png']
});
```

### URL Generation

```typescript
// Before (Firebase)
const url = result.url;

// After (Cloudinary with optimization)
import { getOptimizedUrl } from './lib/storage';
const optimizedUrl = getOptimizedUrl(result.path, {
  width: 800,
  quality: 'auto'
});
```

## Benefits of Migration

### ✅ Cost Savings
- **Firebase**: Requires paid Blaze plan for Storage + Functions
- **Cloudinary**: Generous free tier (25GB storage, 25GB bandwidth)
- **Vercel Functions**: Free tier includes 100GB-hours

### ✅ Performance Improvements
- **Automatic Image Optimization**: Cloudinary auto-optimizes images
- **CDN Delivery**: Global CDN for faster loading
- **Responsive Images**: Dynamic resizing based on device
- **Format Conversion**: Auto WebP/AVIF support

### ✅ Enhanced Features
- **Advanced Transformations**: Resize, crop, filters on-the-fly
- **Video Support**: Better video handling and streaming
- **AI Features**: Auto-tagging, background removal, etc.

## Migration Checklist

- [x] Install Cloudinary dependencies
- [x] Create Cloudinary configuration
- [x] Rewrite storage utilities
- [x] Update Firebase configuration (remove storage/functions)
- [x] Create Vercel Functions for secure operations
- [x] Update environment variables
- [x] Update CSP headers for Cloudinary domains
- [x] Update test mocks
- [ ] Test file uploads in development
- [ ] Test file uploads in production
- [ ] Update deployment pipeline
- [ ] Monitor usage and performance

## File Upload Flow

### Development
1. User selects file in UI
2. File validated on frontend
3. Direct upload to Cloudinary using upload preset
4. Cloudinary returns secure URL and metadata

### Production (Recommended)
1. User selects file in UI
2. Frontend requests signed upload URL from Vercel Function
3. File uploaded to Cloudinary with signature
4. More secure, better control over uploads

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure Cloudinary CORS settings allow your domain
   - Check CSP headers include Cloudinary domains

2. **Upload Preset Not Found**
   - Verify upload preset name in environment variables
   - Ensure preset is set to "unsigned" for direct uploads

3. **File Size Limits**
   - Check Cloudinary account limits
   - Verify frontend validation limits

4. **Authentication Issues**
   - Ensure API keys are correct
   - Check environment variable names (with VITE_ prefix)

### Support

- **Cloudinary Documentation**: https://cloudinary.com/documentation
- **Vercel Functions Guide**: https://vercel.com/docs/functions
- **Project Issues**: Create issue in repository

## Rollback Plan

If issues occur, you can rollback by:

1. Restore `src/lib/storage-firebase-backup.ts` to `src/lib/storage.ts`
2. Update `src/lib/firebase.ts` to include storage imports
3. Remove Cloudinary dependencies
4. Revert environment variables

The backup file contains the original Firebase Storage implementation.