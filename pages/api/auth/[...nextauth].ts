import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import { cert } from 'firebase-admin/app';

// Helper function to safely get Firebase credentials
const getFirebaseCredentials = () => {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    // Check if credentials exist and are not placeholder values
    if (!projectId || !clientEmail || !privateKey ||
        projectId.includes('your_') || projectId.includes('fleetflow-b2exy') ||
        clientEmail.includes('xxxxx') || clientEmail.includes('your_') ||
        privateKey.includes('your_private_key_here') || privateKey.length < 100) {
      console.warn('Firebase credentials not properly configured - using demo auth only');
      return null;
    }

    // Validate that the private key has the correct format
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
      console.warn('Firebase private key format is invalid - using demo auth only');
      return null;
    }

    return {
      projectId,
      clientEmail,
      privateKey,
    };
  } catch (error) {
    console.warn('Error parsing Firebase credentials - using demo auth only:', error);
    return null;
  }
};

const firebaseCredentials = getFirebaseCredentials();

export const authOptions = {
  // Only use FirestoreAdapter if credentials are available
  ...(firebaseCredentials && {
    adapter: FirestoreAdapter({
      credential: cert(firebaseCredentials)
    })
  }),
  providers: [
    // Only include GoogleProvider if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // For demo purposes - in production, verify against your database
        if (credentials?.email === 'admin@fleetflow.com' && credentials?.password === 'admin123') {
          return {
            id: '1',
            email: 'admin@fleetflow.com',
            name: 'FleetFlow Admin',
            role: 'admin'
          };
        }
        if (credentials?.email === 'dispatch@fleetflow.com' && credentials?.password === 'dispatch123') {
          return {
            id: '2',
            email: 'dispatch@fleetflow.com',
            name: 'Dispatch Manager',
            role: 'dispatcher'
          };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

export default NextAuth(authOptions);
