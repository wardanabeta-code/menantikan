# Environment Variables Configuration

## Development Environment (.env.development)
```
VITE_FIREBASE_API_KEY=your_dev_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-dev
VITE_FIREBASE_STORAGE_BUCKET=your-project-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123DEF4
VITE_APP_ENV=development
```

## Production Environment (.env.production)
```
VITE_FIREBASE_API_KEY=your_prod_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654321:web:fedcba654321
VITE_FIREBASE_MEASUREMENT_ID=G-XYZ789ABC1
VITE_APP_ENV=production
```

## Deployment Platform Configurations

### Netlify
- Configure environment variables in Netlify dashboard
- Add build command: `npm run build:production`
- Set publish directory: `dist`

### Vercel
- Configure environment variables in Vercel dashboard
- Build command is auto-detected from package.json
- Output directory: `dist`

### Firebase Hosting
- Environment variables are managed through Firebase config
- Deploy using: `firebase deploy --only hosting`
- Ensure Firebase CLI is installed and authenticated

## Security Notes

1. **Never commit `.env` files to version control**
2. **Use different Firebase projects for dev/staging/production**
3. **Configure Firebase Security Rules properly**
4. **Enable Firebase App Check for production**
5. **Use HTTPS only in production**
6. **Configure proper CORS settings**

## Build Commands

- Development: `npm run dev`
- Production Build: `npm run build:production`
- Bundle Analysis: `npm run build:analyze`
- Preview Production: `npm run preview`

## CI/CD Pipeline

### GitHub Actions Example (.github/workflows/deploy.yml)
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --run
      
      - name: Build
        run: npm run build:production
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Performance Monitoring

1. **Web Vitals**: Automatically tracked with Firebase Performance
2. **Bundle Size**: Monitor with bundlephobia integration
3. **Lighthouse CI**: Automated performance testing
4. **Error Tracking**: Firebase Crashlytics for error monitoring

## Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Test authentication flow
- [ ] Verify Firebase services are working
- [ ] Check mobile responsiveness
- [ ] Test invitation creation and RSVP flows
- [ ] Verify analytics and error tracking
- [ ] Run Lighthouse audit
- [ ] Test with different browsers
- [ ] Verify SSL/HTTPS is working
- [ ] Check all redirect rules are working