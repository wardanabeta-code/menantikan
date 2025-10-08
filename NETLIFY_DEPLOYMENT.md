# Netlify Deployment Guide

This document explains how to deploy the digital invitation application on Netlify with full frontend and backend hosting.

## 🏗️ Architecture Overview

- **Frontend**: Static React app hosted on Netlify CDN
- **Backend**: Netlify Functions for Cloudinary operations
- **Storage**: Cloudinary for media files
- **Database**: Firebase Firestore (free tier)
- **Authentication**: Firebase Auth (free tier)

## 📋 Prerequisites

1. **Netlify Account**: https://netlify.com/
2. **Cloudinary Account**: https://cloudinary.com/
3. **Firebase Project**: Already configured
4. **GitHub Repository**: Connected to your project

## 🚀 Deployment Steps

### 1. Connect Repository to Netlify

1. **Login to Netlify Dashboard**
2. **Click "New site from Git"**
3. **Connect your GitHub account**
4. **Select your repository**
5. **Configure build settings**:
   - Build command: `npm run build:production`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

### 2. Environment Variables

Set these in Netlify Dashboard > Site Settings > Environment Variables:

#### Frontend Variables
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name
VITE_DEPLOY_TARGET=netlify
```

#### Backend Variables (for Netlify Functions)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
```

### 3. Custom Domain (Optional)

1. **Go to Domain settings**
2. **Add custom domain**
3. **Update DNS records** (handled automatically for Netlify DNS)
4. **SSL certificate** is auto-provisioned

## 🔧 Configuration Files

### netlify.toml
```toml
[build]
  publish = "dist"
  command = "npm run build:production"
  functions = "netlify/functions"

[build.environment]
  NODE_ENV = "production"
  VITE_DEPLOY_TARGET = "netlify"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob: https://res.cloudinary.com; connect-src 'self' https://*.firebaseapp.com https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://api.cloudinary.com; frame-src https://*.firebaseapp.com;"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 🛠️ Netlify Functions

### File Structure
```
netlify/
└── functions/
    └── cloudinary.js    # Handles file operations
```

### Function Endpoints
- `/.netlify/functions/cloudinary` - Auto-detected by frontend
- Supports GET (list files), POST (signatures), DELETE (remove files)

## 🔄 Auto-Detection Logic

The frontend automatically detects deployment environment:

```javascript
// Auto-detect API endpoint
const getApiEndpoint = () => {
  // Check if running on Netlify
  if (typeof window !== 'undefined' && window.location.hostname.includes('netlify')) {
    return '/.netlify/functions';
  }
  // Check environment variable
  if (import.meta.env.VITE_DEPLOY_TARGET === 'netlify') {
    return '/.netlify/functions';
  }
  // Default to Vercel (if ever needed)
  return '/api';
};
```

## 📊 Benefits of Netlify Hosting

### ✅ Performance
- **Global CDN**: Fast content delivery worldwide
- **Edge Optimization**: Automatic image optimization
- **Prebuilt Assets**: Cached at edge locations
- **HTTP/2 Support**: Faster loading

### ✅ Developer Experience
- **Git Integration**: Auto-deploy on push
- **Branch Previews**: Preview deploy for PRs
- **Rollback**: One-click rollback to previous versions
- **Build Logs**: Detailed build information

### ✅ Cost Effective
- **Free Tier**: 100GB bandwidth, 300 build minutes
- **Functions**: 125K function invocations/month
- **No Cold Starts**: For frequently accessed functions

## 🔧 Build & Deployment

### Local Development
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
netlify link

# Run local development with functions
netlify dev

# Test functions locally
netlify functions:serve
```

### Manual Deploy
```bash
# Build production version
npm run build:production

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 🚨 Troubleshooting

### Common Issues

1. **Function Not Found**
   - Check `netlify/functions/` directory exists
   - Verify function filename matches endpoint
   - Check Netlify build logs

2. **Environment Variables**
   - Ensure all VITE_ prefixed variables are set
   - Backend variables (without VITE_) for functions
   - Check case sensitivity

3. **CORS Issues**
   - Functions include CORS headers automatically
   - Check Content-Security-Policy in netlify.toml

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs in Netlify dashboard

### Debug Commands
```bash
# Check function logs
netlify logs:functions

# View site info
netlify status

# Test environment variables
netlify env:list
```

## 📈 Monitoring & Analytics

### Built-in Netlify Analytics
- **Page views**: Real-time visitor tracking
- **Performance**: Core Web Vitals
- **Functions**: Execution time and errors
- **Bandwidth**: Usage tracking

### Custom Analytics
- Firebase Analytics already configured
- Google Analytics can be added via environment variables

## 🔒 Security

### Headers
- Security headers configured in netlify.toml
- Content Security Policy includes Cloudinary domains
- HTTPS enforced automatically

### Environment Variables
- Sensitive data in backend environment only
- Frontend variables are publicly accessible
- API secrets never exposed to client

## 🚀 Performance Optimization

### Automatic Optimizations
- **Asset Optimization**: Automatic minification
- **Image Optimization**: Via Cloudinary integration
- **Caching**: Long-term caching for static assets
- **Compression**: Gzip/Brotli compression

### Manual Optimizations
- **Code Splitting**: Already implemented with Vite
- **Lazy Loading**: Components and images
- **Bundle Analysis**: Use `npm run build:analyze`

This setup provides a robust, scalable, and cost-effective hosting solution for your digital invitation application!