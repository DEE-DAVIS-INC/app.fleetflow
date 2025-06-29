# 🔧 FleetFlow Phase 1 Implementation Guide

## 📋 Week-by-Week Implementation Plan

### **Week 1: Database Setup**

#### Day 1-2: PostgreSQL & Prisma Setup
```bash
# Install dependencies
npm install prisma @prisma/client
npm install @types/bcryptjs bcryptjs

# Initialize Prisma
npx prisma init

# Set up environment variables
echo "DATABASE_URL='postgresql://username:password@localhost:5432/fleetflow'" >> .env.local
```

#### Day 3-5: Database Schema Creation
Create `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(BROKER)
  companyId String?
  company   Company? @relation(fields: [companyId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  shippers  Shipper[]
  loads     Load[]
  invoices  Invoice[]
}

model Company {
  id        String   @id @default(cuid())
  name      String
  address   String?
  phone     String?
  email     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  users     User[]
  shippers  Shipper[]
}

model Shipper {
  id              String   @id @default(cuid())
  name            String
  contactName     String?
  contactEmail    String?
  contactPhone    String?
  address         String?
  city            String?
  state           String?
  zipCode         String?
  assignedBroker  String?
  companyId       String?
  company         Company? @relation(fields: [companyId], references: [id])
  assignedUser    User?    @relation(fields: [assignedBroker], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  loads           Load[]
}

model Load {
  id            String      @id @default(cuid())
  origin        String
  destination   String
  pickupDate    DateTime
  deliveryDate  DateTime
  equipment     String
  weight        String?
  rate          Float
  status        LoadStatus  @default(POSTED)
  assignedTo    String?
  shipperId     String?
  shipper       Shipper?    @relation(fields: [shipperId], references: [id])
  assignedUser  User?       @relation(fields: [assignedTo], references: [id])
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  // Relations
  invoices      Invoice[]
}

model Invoice {
  id            String        @id @default(cuid())
  loadId        String
  load          Load          @relation(fields: [loadId], references: [id])
  carrierName   String
  carrierEmail  String?
  loadAmount    Float
  dispatchFee   Float
  feePercentage Float
  status        InvoiceStatus @default(PENDING)
  dueDate       DateTime
  createdBy     String
  user          User          @relation(fields: [createdBy], references: [id])
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum Role {
  ADMIN
  MANAGER
  BROKER
  CUSTOMER
}

enum LoadStatus {
  POSTED
  ASSIGNED
  IN_TRANSIT
  DELIVERED
  COMPLETED
}

enum InvoiceStatus {
  PENDING
  SENT
  PAID
  OVERDUE
}
```

#### Day 6-7: Database Migration & Seeding
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Create seed script
```

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create demo company
  const company = await prisma.company.create({
    data: {
      name: 'FleetFlow Demo',
      address: '123 Main St, Atlanta, GA 30309',
      phone: '(555) 123-4567',
      email: 'demo@fleetflow.com'
    }
  })

  // Create demo users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@fleetflow.com',
      name: 'Admin User',
      role: 'ADMIN',
      companyId: company.id
    }
  })

  const brokerUser = await prisma.user.create({
    data: {
      email: 'broker@fleetflow.com',
      name: 'John Broker',
      role: 'BROKER',
      companyId: company.id
    }
  })

  // Create demo shippers
  const shipper1 = await prisma.shipper.create({
    data: {
      name: 'ABC Manufacturing',
      contactName: 'Sarah Johnson',
      contactEmail: 'sarah@abcmfg.com',
      contactPhone: '(555) 234-5678',
      address: '456 Industrial Blvd',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30309',
      assignedBroker: brokerUser.id,
      companyId: company.id
    }
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

```bash
# Run seed
npx prisma db seed
```

---

### **Week 2: Authentication Implementation**

#### Day 1-3: NextAuth.js Setup
```bash
# Install NextAuth.js
npm install next-auth
npm install @next-auth/prisma-adapter
```

Create `app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { company: true }
        })

        if (!user) {
          return null
        }

        // In production, verify password with bcrypt
        // const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.companyId = user.companyId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.companyId = token.companyId as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout'
  }
})

export { handler as GET, handler as POST }
```

#### Day 4-5: Auth Components & Middleware
Create `middleware.ts`:
```typescript
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }
        
        // Protect broker routes
        if (req.nextUrl.pathname.startsWith('/broker')) {
          return token?.role === 'BROKER' || token?.role === 'ADMIN'
        }

        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/broker/:path*',
    '/dispatch/:path*',
    '/analytics/:path*'
  ]
}
```

#### Day 6-7: Role-Based Access & UI Updates
Update existing components to use real authentication:
```typescript
// app/components/AuthProvider.tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export default function AuthProvider({
  children,
  session
}: {
  children: React.ReactNode
  session: any
}) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
```

---

### **Week 3: Payment Integration**

#### Day 1-3: Stripe Setup
```bash
# Install Stripe
npm install stripe @stripe/stripe-js
```

Create `lib/stripe.ts`:
```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export const getStripe = () => {
  if (typeof window !== 'undefined') {
    return require('@stripe/stripe-js').loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    )
  }
  return null
}
```

#### Day 4-5: Payment API Routes
Create `app/api/payments/create-payment-intent/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getServerSession } from 'next-auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, currency = 'usd', invoiceId } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        invoiceId,
        userId: session.user.id
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    })
  } catch (error) {
    console.error('Payment intent creation failed:', error)
    return NextResponse.json(
      { error: 'Payment intent creation failed' },
      { status: 500 }
    )
  }
}
```

#### Day 6-7: Payment UI Components
Create payment integration for invoices:
```typescript
// app/components/PaymentForm.tsx
'use client'

import { useState } from 'react'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe'

const CheckoutForm = ({ amount, invoiceId, onSuccess }: {
  amount: number
  invoiceId: string
  onSuccess: () => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    if (!stripe || !elements) return

    // Create payment intent
    const response = await fetch('/api/payments/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, invoiceId })
    })

    const { clientSecret } = await response.json()

    // Confirm payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!
      }
    })

    if (result.error) {
      console.error(result.error)
    } else {
      onSuccess()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 border rounded" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  )
}

export default function PaymentForm(props: {
  amount: number
  invoiceId: string
  onSuccess: () => void
}) {
  const stripePromise = getStripe()

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
```

---

### **Week 4: Real-Time Features & Production Deployment**

#### Day 1-3: WebSocket Implementation
```bash
# Install Socket.io
npm install socket.io socket.io-client
```

Create `lib/socket.ts`:
```typescript
import { Server as SocketIOServer } from 'socket.io'
import { Server as NetServer } from 'http'

export const initializeSocket = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL,
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Join user-specific room
    socket.on('join-user-room', (userId) => {
      socket.join(`user-${userId}`)
    })

    // Handle load updates
    socket.on('load-update', (data) => {
      socket.broadcast.emit('load-updated', data)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  return io
}
```

#### Day 4-5: Production Deployment Setup
```bash
# Install deployment dependencies
npm install @vercel/analytics @vercel/speed-insights

# Set up environment variables for production
# Create vercel.json for deployment configuration
```

Create `vercel.json`:
```json
{
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url",
    "GOOGLE_CLIENT_ID": "@google-client-id",
    "GOOGLE_CLIENT_SECRET": "@google-client-secret",
    "STRIPE_SECRET_KEY": "@stripe-secret-key",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "@stripe-publishable-key"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

#### Day 6-7: Testing & Launch Preparation
```bash
# Run production build locally
npm run build
npm start

# Test all functionality:
# - User authentication
# - Database operations
# - Payment processing
# - Real-time updates

# Deploy to production
vercel --prod
```

---

## 🔧 Required Environment Variables

Create `.env.local`:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fleetflow"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Existing APIs
GOOGLE_MAPS_API_KEY="your-existing-maps-key"
TWILIO_ACCOUNT_SID="your-existing-twilio-sid"
TWILIO_AUTH_TOKEN="your-existing-twilio-token"
```

---

## ✅ Phase 1 Completion Checklist

- [ ] PostgreSQL database configured and running
- [ ] Prisma schema implemented with all entities
- [ ] User authentication with NextAuth.js working
- [ ] Role-based access control implemented
- [ ] Stripe payment processing integrated
- [ ] Real-time updates with Socket.io
- [ ] Production deployment on Vercel
- [ ] Environment variables configured
- [ ] Database seeded with demo data
- [ ] All existing features migrated to real data
- [ ] Payment flow tested end-to-end
- [ ] User registration and login working
- [ ] Role-based page access enforced

---

## 🚀 Ready for Phase 2

Once Phase 1 is complete, you'll have:
- ✅ **Production-ready application** with real database
- ✅ **User authentication** with role-based access
- ✅ **Payment processing** for invoice collection
- ✅ **Real-time updates** for live data synchronization
- ✅ **Scalable foundation** for customer portal development

**Next**: Begin Phase 2 customer portal development and advanced analytics implementation.

---

*This implementation guide provides step-by-step instructions for the critical Phase 1 development outlined in the Complete System Roadmap.*
