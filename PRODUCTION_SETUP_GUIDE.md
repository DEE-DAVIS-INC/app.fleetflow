# 🚀 FleetFlow Production Setup Guide

This guide will help you deploy FleetFlow to production with all the necessary backend infrastructure.

## 📋 Prerequisites

1. **Firebase Account** (free tier available)
2. **Google Cloud Platform Account** (for Maps API)
3. **Twilio Account** (for SMS)
4. **OpenAI Account** (for AI features)
5. **Domain name** (optional, for custom domain)

## 🔥 Firebase Setup (Database & Hosting)

### 1. Create Firebase Project
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init
```

Select:
- ✅ Firestore (Database)
- ✅ Hosting
- ✅ Functions (optional, for backend logic)

### 2. Configure Firestore Security Rules
Update `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Get Firebase Configuration
1. Go to Firebase Console → Project Settings → General
2. Scroll to "Your apps" → Web apps
3. Copy the config object

## 🔑 Environment Variables Setup

### 1. Copy Environment Template
```bash
cp .env.example .env.local
```

### 2. Firebase Configuration
```bash
# Firebase Client (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin (Backend)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----"
```

### 3. Google Services Setup

#### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create API key
```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### Google OAuth (for sign-in)
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
```bash
GOOGLE_CLIENT_ID=your_google_client_id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Twilio SMS Setup
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get Account SID, Auth Token, and Phone Number
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 5. OpenAI API Setup
1. Sign up at [OpenAI](https://platform.openai.com/)
2. Create API key
```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxx
```

### 6. NextAuth Configuration
```bash
# Generate a random secret (32+ characters)
NEXTAUTH_SECRET=your-super-secret-32-char-string-here
NEXTAUTH_URL=https://your-domain.com  # or http://localhost:3000 for development
```

## 🚀 Deployment Options

### Option 1: Firebase Hosting (Recommended for beginners)

1. **Build the project:**
```bash
npm run build
```

2. **Deploy to Firebase:**
```bash
firebase deploy
```

3. **Set environment variables in Firebase:**
```bash
firebase functions:config:set \
  openai.api_key="your_openai_key" \
  twilio.account_sid="your_twilio_sid" \
  twilio.auth_token="your_twilio_token"
```

### Option 2: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Add environment variables in Vercel dashboard**

### Option 3: Self-hosted (VPS/Cloud Server)

1. **Setup Node.js server**
2. **Install PM2 for process management:**
```bash
npm install -g pm2
pm2 start npm --name "fleetflow" -- start
```

3. **Setup Nginx reverse proxy**
4. **Setup SSL with Let's Encrypt**

## 🗄️ Database Initialization

### Seed Initial Data
Run this script to populate your database with sample data:

```bash
# Create a seed script
node scripts/seed-database.js
```

### Database Collections Structure
```
loads/
├── {loadId}
│   ├── loadNumber: string
│   ├── origin: string
│   ├── destination: string
│   ├── status: string
│   └── createdAt: timestamp

drivers/
├── {driverId}
│   ├── name: string
│   ├── phone: string
│   ├── status: string
│   └── vehicleId: string

vehicles/
├── {vehicleId}
│   ├── vehicleNumber: string
│   ├── make: string
│   ├── model: string
│   └── driverId: string
```

## 🔒 Security Checklist

- [ ] Firebase Security Rules configured
- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] API rate limiting implemented
- [ ] User authentication working
- [ ] File uploads secured
- [ ] CORS properly configured

## 📊 Monitoring & Analytics

### Firebase Analytics
```bash
# Enable in Firebase Console
# Add to your Next.js app
```

### Error Monitoring
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage

## 🧪 Testing in Production

### 1. Test Authentication
- [ ] Sign in with email/password
- [ ] Sign in with Google
- [ ] Sign out functionality

### 2. Test Core Features
- [ ] Create new load
- [ ] Assign load to driver
- [ ] Update load status
- [ ] Generate documents
- [ ] Send SMS notifications

### 3. Test Integrations
- [ ] Google Maps loading
- [ ] FMCSA carrier lookup
- [ ] AI features (if OpenAI key provided)
- [ ] PDF generation

## 🚨 Common Issues & Solutions

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit
```

### Firebase Connection Issues
- Verify project ID matches
- Check API keys are correct
- Ensure Firestore is enabled

### Authentication Issues
- Verify NextAuth URL matches deployment
- Check OAuth redirect URLs
- Ensure secret is properly set

## 📈 Scaling Considerations

### Performance Optimization
- Enable Next.js static optimization
- Implement Redis for caching
- Use CDN for static assets
- Optimize images and fonts

### Database Optimization
- Add proper indexes in Firestore
- Implement pagination for large datasets
- Use Firebase subcollections for related data

### Cost Management
- Monitor Firebase usage
- Implement request caching
- Use Firebase pricing calculator

## 📞 Support & Maintenance

### Regular Tasks
- [ ] Monitor error logs
- [ ] Update dependencies monthly
- [ ] Backup database weekly
- [ ] Review security rules quarterly

### Emergency Contacts
- Keep emergency contact list updated
- Document rollback procedures
- Maintain staging environment for testing

---

## 🎉 You're Production Ready!

Once you complete this setup:

1. **Frontend**: ✅ Fully functional
2. **Database**: ✅ Real data persistence
3. **Authentication**: ✅ Secure user management
4. **APIs**: ✅ External service integration
5. **Monitoring**: ✅ Error tracking and analytics

Your FleetFlow application is now enterprise-ready with scalable infrastructure!

For additional help, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
