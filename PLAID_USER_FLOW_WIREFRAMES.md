# FleetFlow User Sign-Up Flow with Plaid Link Integration

## Overview

This document provides detailed wireframes and flow descriptions showing where and how Plaid Link is
initialized in the FleetFlow user sign-up process. This is for Plaid Risk team review for Production
access approval.

---

## Sign-Up Flow Architecture

### Step-by-Step User Journey

#### **Step 1: Landing Page & Initial Registration**

```
┌─────────────────────────────────────────────────────────────────┐
│                          FleetFlow™                             │
│                    Transportation Management                     │
│                                                                 │
│   [🚛 Logo]              FleetFlow™                            │
│                                                                 │
│             Start Your Free Trial                              │
│         ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│         │ 14 Days Free│ │   Secure    │ │Cancel Anytime│      │
│         └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                                 │
│   Step 1: Personal Information                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ First Name: [_______________]  Last Name: [___________] │  │
│   │ Email: [_________________________________________]      │  │
│   │ Phone: [_________________________________________]      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                  [Next →]                      │
└─────────────────────────────────────────────────────────────────┘
```

#### **Step 2-4: Account Setup & Company Information**

```
┌─────────────────────────────────────────────────────────────────┐
│  Progress: ████████████░░░░░░░░░░░░░░  Step 4 of 6             │
│                                                                 │
│   Choose Your Plan                                              │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ ◉ Professional Dispatcher ($79/month)                   │  │
│   │   Complete dispatch management + phone                   │  │
│   │                                                         │  │
│   │ ○ Professional Brokerage ($289/month)                   │  │
│   │   Advanced brokerage operations + phone                 │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ☑ I agree to Terms of Service and Privacy Policy            │
│   ☐ I'd like to receive updates about FleetFlow features      │
│                                                                 │
│                      [← Back]    [Next →]                      │
└─────────────────────────────────────────────────────────────────┘
```

#### **Step 5: Payment Method & Plaid Link Integration Point**

```
┌─────────────────────────────────────────────────────────────────┐
│  Progress: ████████████████████░░░░  Step 5 of 6               │
│                                                                 │
│   Secure Your Trial                                            │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ 🔒 We'll securely verify your card details. You won't   │  │
│   │    be charged until your 14-day free trial ends.       │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   Payment Method:                                              │
│   ○ Credit/Debit Card                                          │
│   ● Bank Account (ACH) - Save on fees! ⭐ RECOMMENDED         │
│                                                                 │
│   [When Bank Account is selected, Plaid Link opens]           │
│                                                                 │
│   Card Information (if card selected):                         │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ Card Number: [1234 5678 9012 3456]                     │  │
│   │ Month: [MM] Year: [YYYY] CVC: [123]                    │  │
│   │ Name on Card: [________________________]               │  │
│   │ Billing Address: [____________________]                 │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│               [← Back]    [Continue with Bank] [Next →]        │
└─────────────────────────────────────────────────────────────────┘
```

#### **Step 5a: Plaid Link Initialization Flow**

```
┌─────────────────────────────────────────────────────────────────┐
│                    🔗 Connect Your Bank                        │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │              Secure Bank Connection                      │  │
│   │                                                         │  │
│   │  🔒 FleetFlow partners with Plaid to securely connect  │  │
│   │     your bank account. Your login credentials are      │  │
│   │     never stored by FleetFlow or Plaid.                │  │
│   │                                                         │  │
│   │  Benefits:                                              │  │
│   │  • Lower processing fees than credit cards             │  │
│   │  • Faster settlement processing                        │  │
│   │  • Automated financial reporting                       │  │
│   │  • Real-time cash flow insights                        │  │
│   │                                                         │  │
│   │       [Continue with Bank Connection]                  │  │
│   │            [Use Credit Card Instead]                   │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  📋 Your data is protected by bank-level security             │
│  🔒 256-bit encryption • SOX compliant • GDPR compliant       │
└─────────────────────────────────────────────────────────────────┘
```

#### **Step 5b: Plaid Link Modal/Widget Opens**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Plaid Link Interface                        │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  🏦 Select Your Bank                                   │  │
│   │                                                         │  │
│   │  Search: [type bank name...]                 [🔍]      │  │
│   │                                                         │  │
│   │  Popular Banks:                                         │  │
│   │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │  │
│   │  │  Chase Bank  │ │ Bank of      │ │    Wells     │   │  │
│   │  │      🏛️      │ │  America 🏛️  │ │   Fargo 🏛️   │   │  │
│   │  └──────────────┘ └──────────────┘ └──────────────┘   │  │
│   │                                                         │  │
│   │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │  │
│   │  │   Citibank   │ │   US Bank    │ │   PNC Bank   │   │  │
│   │  │      🏛️      │ │      🏛️      │ │      🏛️      │   │  │
│   │  └──────────────┘ └──────────────┘ └──────────────┘   │  │
│   │                                                         │  │
│   │  Regional & Credit Unions ▼                           │  │
│   │                                                         │  │
│   │              [Continue] [Cancel]                        │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   Powered by Plaid • Your credentials are never stored        │
└─────────────────────────────────────────────────────────────────┘
```

#### **Step 5c: Bank Login via Plaid**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Bank Authentication                         │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  🏦 Chase Online Banking Login                         │  │
│   │                                                         │  │
│   │  Username: [________________________]                  │  │
│   │  Password: [________________________]                  │  │
│   │                                                         │  │
│   │             [Sign In to Chase]                         │  │
│   │                                                         │  │
│   │  🔒 This connection is secured by Plaid               │  │
│   │     Your credentials are encrypted and never           │  │
│   │     shared with FleetFlow                              │  │
│   │                                                         │  │
│   │  Need help? Visit Chase.com                           │  │
│   │                                                         │  │
│   │              [← Back] [Continue]                       │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   🛡️ Bank-level security • Read-only access                   │
└─────────────────────────────────────────────────────────────────┘
```

#### **Step 5d: Account Selection via Plaid**

```
┌─────────────────────────────────────────────────────────────────┐
│                   Select Account for Payments                  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Choose which account to use for FleetFlow payments:   │  │
│   │                                                         │  │
│   │  ● Business Checking (...4892)                        │  │
│   │    Balance: $12,450.23                                 │  │
│   │    ✅ Recommended for business transactions            │  │
│   │                                                         │  │
│   │  ○ Business Savings (...7743)                         │  │
│   │    Balance: $45,230.11                                 │  │
│   │    ⚠️ May have transfer limits                          │  │
│   │                                                         │  │
│   │  ○ Personal Checking (...1234)                        │  │
│   │    Balance: $3,240.87                                  │  │
│   │                                                         │  │
│   │  Data Usage: Account verification and payment          │  │
│   │  processing only. Transaction history used for         │  │
│   │  financial analytics (optional).                       │  │
│   │                                                         │  │
│   │       [← Back] [Connect Selected Account]              │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### **Step 5e: Plaid Link Success & Return to FleetFlow**

```
┌─────────────────────────────────────────────────────────────────┐
│  Progress: ████████████████████░░░░  Step 5 of 6               │
│                                                                 │
│   ✅ Bank Account Connected Successfully!                      │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ 🏦 Chase Business Checking (...4892)                   │  │
│   │ ✅ Verified and ready for payments                     │  │
│   │                                                         │  │
│   │ You'll save an average of $47/month in processing      │  │
│   │ fees compared to credit card payments.                 │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   Payment Schedule:                                            │
│   • Free trial: 14 days (ends Feb 15, 2025)                  │
│   • First charge: Feb 16, 2025                               │
│   • Monthly billing: $79.00 on the 16th                      │
│                                                                 │
│   ☑ I authorize FleetFlow to charge my connected account      │
│       for subscription fees after the trial period            │
│                                                                 │
│                      [← Back]    [Continue →]                  │
└─────────────────────────────────────────────────────────────────┘
```

#### **Step 6: Profile Completion**

```
┌─────────────────────────────────────────────────────────────────┐
│  Progress: ████████████████████████  Step 6 of 6               │
│                                                                 │
│   Complete Your Profile                                        │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ 🎉 Almost done! Just a few more details to personalize │  │
│   │    your FleetFlow experience.                          │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   Emergency Contact & Work Preferences                         │
│   [Additional profile fields...]                              │
│                                                                 │
│                   [← Back] [Activate Free Trial 🚀]           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Technical Implementation Details

### **Plaid Link Configuration**

```javascript
// Link Token Request
const linkTokenRequest = {
  user: { client_user_id: userId },
  client_name: 'FleetFlow',
  products: ['transactions', 'auth', 'identity'],
  country_codes: ['US'],
  language: 'en',
  webhook: 'https://fleetflowapp.com/api/plaid/webhook',
};
```

### **Data Usage Declaration**

- **Account Verification**: Verify ownership for payment setup
- **Payment Processing**: ACH transactions for subscription billing
- **Financial Analytics**: Optional cash flow insights (user consent)
- **Compliance**: 7-year retention for SOX requirements

### **Security Measures**

- ✅ Bank-level 256-bit encryption
- ✅ Read-only access to financial data
- ✅ No credential storage by FleetFlow
- ✅ GDPR/CCPA compliant data handling
- ✅ SOX compliant retention policies

### **User Consent Points**

1. **Privacy Policy Acceptance** (Step 4)
2. **Plaid Connection Consent** (Step 5a)
3. **Account Selection & Usage** (Step 5d)
4. **Payment Authorization** (Step 5e)

---

## Production Environment Details

- **Domain**: fleetflowapp.com
- **Plaid Environment**: Production
- **Client ID**: 68a801029ea54d0022a62020
- **Webhook URL**: https://fleetflowapp.com/api/plaid/webhook
- **Privacy Policy**: https://fleetflowapp.com/privacy-policy
- **Terms of Service**: https://fleetflowapp.com/terms-of-service

---

## Compliance & Data Protection

### **GDPR Compliance**

- ✅ Explicit user consent before data collection
- ✅ Right to access, rectify, delete, and port data
- ✅ Data minimization (only collect what's necessary)
- ✅ Purpose limitation (clearly stated use cases)

### **CCPA Compliance**

- ✅ Privacy policy disclosure requirements
- ✅ Do not sell personal information
- ✅ Right to delete and opt-out

### **Financial Regulations**

- ✅ SOX compliance (7-year retention)
- ✅ PCI DSS standards for payment processing
- ✅ Bank Secrecy Act compliance
