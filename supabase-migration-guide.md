# FleetFlow: Firebase to Supabase Migration Guide

## 🎯 Overview

This guide walks you through migrating your FleetFlow application from Firebase to Supabase. Supabase is an open-source Firebase alternative that provides:

- **PostgreSQL Database** (more powerful than Firestore)
- **Real-time subscriptions** (like Firebase real-time database)
- **Built-in authentication** (similar to Firebase Auth)
- **Row Level Security** (better security model)
- **REST API** (automatic API generation)
- **Better developer experience** (SQL, dashboard, etc.)

## 🚀 Quick Start

### Step 1: Set up Supabase Project

1. **Create Account**: Go to https://supabase.com/dashboard
2. **Create New Project**: Click "New Project"
3. **Fill Details**:
   - Project name: `fleetflow-production` (or your preferred name)
   - Database password: Generate a strong password
   - Region: Choose closest to your users
4. **Wait for Setup**: Takes 1-2 minutes

### Step 2: Get Your Credentials

1. **Go to Settings**: In your Supabase dashboard, click Settings → API
2. **Copy Values**:
   - `Project URL`: `https://your-project-id.supabase.co`
   - `anon public key`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Set Up Environment Variables

1. **Copy Template**: 
   ```bash
   cp .env.local.template .env.local
   ```

2. **Update `.env.local`**:
   ```bash
   # Replace with your actual values
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 4: Set Up Database Schema

1. **Open SQL Editor**: In Supabase dashboard → SQL Editor
2. **Run Schema**: Copy and paste the entire contents of `supabase-setup.sql`
3. **Execute**: Click "Run" button
4. **Verify**: Check that tables were created in Table Editor

### Step 5: Start Your Application

```bash
npm run dev
```

Visit `http://localhost:3000` - Your chat should now work!

## 📋 What's Changed

### Files Updated:
- ✅ `lib/supabase.ts` - New Supabase client
- ✅ `app/components/SupabaseAuthProvider.tsx` - New auth provider
- ✅ `app/components/NotificationBell.tsx` - Updated for Supabase
- ✅ `app/providers.tsx` - Uses Supabase auth
- ✅ `.env.local.template` - Supabase environment variables

### Files Created:
- ✅ `supabase-setup.sql` - Database schema
- ✅ `supabase-migration-guide.md` - This guide

### Files Deprecated (but kept for reference):
- ❌ `lib/firebase.ts` - Old Firebase config
- ❌ `app/components/AuthProvider.tsx` - Old auth provider

## 🔧 Technical Changes

### Authentication
- **Before**: Firebase Auth with manual user state management
- **After**: Supabase Auth with automatic user profiles

### Database
- **Before**: Firestore (NoSQL) with collections
- **After**: PostgreSQL (SQL) with tables and relationships

### Real-time Updates
- **Before**: Firebase `onSnapshot` listeners
- **After**: Supabase real-time subscriptions

### Security
- **Before**: Firebase Security Rules
- **After**: Supabase Row Level Security (RLS)

## 🏗️ Database Schema

Your new PostgreSQL database includes:

### Core Tables:
- `user_profiles` - User account information
- `notifications` - Real-time notifications
- `loads` - Freight loads/shipments
- `shippers` - Shipper companies
- `carriers` - Carrier companies
- `drivers` - Driver information
- `vehicles` - Vehicle/truck information
- `sticky_notes` - User sticky notes

### Features:
- **Automatic user profile creation** on signup
- **Real-time notifications** with read/unread status
- **Row Level Security** for data protection
- **Performance indexes** for fast queries
- **Sample data** for testing

## 🔒 Security Features

### Row Level Security (RLS):
- Users can only see their own profiles and notifications
- All authenticated users can view/modify loads, shippers, carriers
- Drivers can only see their own driver records

### Authentication:
- Email/password authentication
- Automatic user profile creation
- Role-based permissions (Admin, Manager, Dispatcher, Driver, Viewer)

## 🎯 Benefits of Supabase

### Developer Experience:
- **SQL Database**: More powerful queries than NoSQL
- **Auto-generated APIs**: REST API created automatically
- **Real-time Dashboard**: Visual database management
- **Better TypeScript Support**: Generated types

### Performance:
- **Faster Queries**: PostgreSQL is highly optimized
- **Indexing**: Proper database indexes for performance
- **Connection Pooling**: Built-in connection management

### Cost:
- **Free Tier**: More generous than Firebase
- **Predictable Pricing**: No surprise bills
- **Open Source**: Can self-host if needed

## 🧪 Testing Your Migration

### 1. Test Authentication:
```bash
# Visit your app
npm run dev

# Try signing up a new user
# Check user_profiles table in Supabase dashboard
```

### 2. Test Real-time Features:
```bash
# Open two browser windows
# Create a notification in one window
# Should appear in real-time in the other window
```

### 3. Test Data Operations:
```bash
# Create a new load/shipment
# Check loads table in Supabase dashboard
# Verify RLS policies are working
```

## 🚨 Troubleshooting

### Common Issues:

1. **"Invalid API Key" Error**:
   - Check your `.env.local` file
   - Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Restart your dev server

2. **"Row Level Security Policy Violation"**:
   - User might not be properly authenticated
   - Check RLS policies in Supabase dashboard
   - Verify user_profiles table has correct permissions

3. **Real-time Not Working**:
   - Check browser console for errors
   - Verify real-time is enabled in Supabase settings
   - Check table permissions

### Getting Help:
- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **GitHub Issues**: Check the FleetFlow repository

## 🔄 Rollback Plan

If you need to revert to Firebase:

1. **Update providers.tsx**:
   ```typescript
   import { AuthProvider } from './components/AuthProvider';
   // Replace SupabaseAuthProvider with AuthProvider
   ```

2. **Restore Firebase config**:
   - Add Firebase env variables back to `.env.local`
   - The `lib/firebase.ts` file is still available

3. **Update NotificationBell**:
   - Revert to Firebase imports
   - The original code is in git history

## 📈 Next Steps

### Production Deployment:
1. **Set up production Supabase project**
2. **Configure production environment variables**
3. **Set up database backups**
4. **Configure custom domain** (if needed)

### Advanced Features:
1. **Edge Functions**: For serverless functions
2. **Storage**: For file uploads
3. **Real-time Chat**: Build on real-time subscriptions
4. **Analytics**: Track user behavior

## 🎉 Conclusion

Your FleetFlow application is now powered by Supabase! This migration provides:

- ✅ Better performance and scalability
- ✅ More powerful database features
- ✅ Better developer experience
- ✅ Cost-effective pricing
- ✅ Modern authentication system

Your chat and all other features should now work perfectly with proper authentication and real-time capabilities.