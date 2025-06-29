# 🚛 FleetFlow - Enhanced Fleet Management Platform

> **Professional-grade fleet management with advanced invoice automation and analytics**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.10-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)](https://reactjs.org/)

## 🌟 Enhanced Features Overview

FleetFlow has been **completely enhanced** with enterprise-grade features including professional invoice management, automated email systems, comprehensive analytics, and modern UI/UX design.

### 🆕 Latest Enhancements

- 📄 **Professional Invoice System** - Complete automation from generation to payment tracking
- 📧 **Advanced Email Automation** - Professional templates with automated follow-ups
- 📊 **Enhanced Analytics Dashboard** - Comprehensive business intelligence with invoice metrics
- 🎨 **Modern UI/UX** - Clean, responsive design with improved user experience
- 🔗 **Unified API System** - SMS and Email notifications in single endpoint
- 💰 **Financial Tracking** - Advanced payment collection and overdue management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FLEETFLOW

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the enhanced FleetFlow dashboard.

---

## 🏗️ Enhanced Architecture

### **Core Components**
```
📁 app/
├── 📄 components/
│   ├── DispatchInvoice.tsx     # Professional invoice component
│   ├── Navigation.tsx          # Enhanced navigation with access control
│   └── ...
├── 📧 services/
│   ├── email.ts               # Advanced email automation service
│   └── sms.ts                 # SMS notification service
├── 🔗 api/
│   └── notifications/send/     # Unified notification API
├── 📊 analytics/              # Enhanced analytics dashboard
├── 🚛 dispatch/               # Advanced dispatch central
└── ...
```

### **New Services**
- **Email Service**: Professional templates and automation
- **Invoice Management**: Complete lifecycle tracking
- **Analytics Engine**: Business intelligence and reporting
- **Notification API**: Unified SMS/Email communication

---

## 📊 Enhanced Analytics Dashboard

### **Invoice Analytics**
- 📈 Revenue vs Payment Trends
- 💰 Payment Status Distribution  
- 📊 Monthly Dispatch Fee Tracking
- 🏆 Top Carriers Analysis

### **Business Intelligence**
- 💹 Collection Rate Monitoring
- ⏰ Average Payment Days
- ⚠️ Overdue Amount Tracking
- 📋 Performance Metrics

**Access**: `http://localhost:3000/analytics` (Manager/Admin access required)

---

## 🧾 Professional Invoice Management

### **Features**
- ✅ Professional invoice design with company branding
- ✅ PDF generation and download
- ✅ Automated email delivery with templates
- ✅ Payment status tracking (Pending/Sent/Paid/Overdue)
- ✅ Complete carrier information integration
- ✅ Detailed load and service breakdown

### **Invoice Operations**
```typescript
// Generate professional invoice
const invoice = await generateInvoice(loadData);

// Send via email with professional template
await sendInvoiceEmail(carrierEmail, invoice);

// Generate PDF for download/print
const pdf = await generateInvoicePDF(invoice);
```

---

## 📧 Advanced Email Automation

### **Professional Templates**
- 📧 **Invoice Delivery**: Comprehensive invoice emails with branding
- ⚠️ **Overdue Notices**: Escalating reminder system
- 💼 **Professional Communication**: Business-standard messaging

### **Automation Features**
- 🔄 Scheduled follow-ups (1, 7, 14, 30 days)
- 📊 Status-based triggers
- 📎 PDF attachment support
- 🎯 Priority-based delivery

### **Usage**
```typescript
// Send professional invoice email
const template = generateInvoiceEmailTemplate(invoiceData);
await sendInvoiceEmail(carrierEmail, template);

// Schedule automated follow-ups
scheduleFollowUpEmails({
  invoiceId: 'INV-001',
  carrierEmail: 'billing@carrier.com',
  invoiceData: invoice,
  reminderDays: [1, 7, 14, 30]
});
```

---

## 🔗 Unified Notification API

### **Enhanced Endpoint**: `/api/notifications/send`

Supports both SMS and Email notifications with professional templates.

#### **SMS Notification**
```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "sms",
    "to": "+1234567890",
    "message": "Your FleetFlow dispatch invoice is ready",
    "priority": "normal"
  }'
```

#### **Email Notification**
```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "to": "billing@carrier.com",
    "subject": "FleetFlow Invoice INV-001",
    "message": "Please find your dispatch invoice attached",
    "htmlMessage": "<h1>Invoice Ready</h1><p>Your invoice is attached.</p>",
    "attachments": ["Invoice-INV-001.pdf"],
    "priority": "normal"
  }'
```

---

## 🎯 Access Control System

### **Role-Based Access**
- 👤 **Driver**: Basic fleet information
- 📋 **Dispatcher**: Operational access
- 👨‍💼 **Manager**: Full access including analytics and financials
- 🔧 **Admin**: Complete system access

### **Protected Features**
- 📊 Analytics Dashboard (Manager/Admin)
- 💰 Financial Management (Manager/Admin)
- 🧾 Invoice Management (Dispatcher/Manager/Admin)
- ⚙️ System Settings (Admin)

---

## 🛠️ Configuration

### **Environment Variables**
```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# SMTP Email Configuration (Optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# Next.js Configuration
NEXT_PUBLIC_APP_ENV=development
```

### **Development vs Production**
- **Development**: Uses mock SMS/Email for testing
- **Production**: Requires Twilio and SMTP configuration

---

## 📱 Testing Enhanced Features

### **Run Test Script**
```bash
./test-enhanced-features.sh
```

### **Manual Testing**
1. **Dashboard**: Visit `http://localhost:3000`
2. **Analytics**: Navigate to Analytics (Manager access)
3. **Dispatch Central**: Test invoice generation and sending
4. **SMS Testing**: Use `/sms-test` page for SMS functionality
5. **API Testing**: Use provided curl commands

---

## 🚀 Deployment Options

### **Vercel (Recommended)**
```bash
npm run build
npx vercel --prod
```

### **Firebase Hosting**
```bash
npm run build
npm run deploy
```

### **Custom Server**
```bash
npm run build
npm start
```

---

## 📈 Performance Features

### **Optimizations**
- ⚡ Server-side rendering with Next.js
- 🎯 Component lazy loading
- 📊 Efficient chart rendering with Chart.js
- 🔄 Optimized API caching
- 📱 Responsive design for all devices

### **Monitoring**
- 📊 Built-in analytics tracking
- 🚨 Error logging and reporting
- 📈 Performance metrics collection
- 🔍 API usage monitoring

---

## 🛣️ Roadmap

### **Next Phase Enhancements**
- [ ] 💳 **Payment Integration** - Stripe/PayPal integration
- [ ] 🔄 **Background Jobs** - Queue system for email automation
- [ ] 📱 **Mobile App** - React Native companion
- [ ] 🔗 **API Webhooks** - External system integration
- [ ] 🛡️ **Advanced Security** - OAuth 2.0 and JWT
- [ ] 📊 **Custom Reports** - Advanced reporting system

### **Enterprise Features**
- [ ] 🏢 **Multi-tenant Support** - Multiple organization handling
- [ ] 🔐 **SSO Integration** - Single sign-on capabilities
- [ ] 📋 **Compliance Tools** - DOT and FMCSA compliance
- [ ] 🤖 **AI/ML Features** - Predictive analytics
- [ ] 🌐 **Real-time Updates** - WebSocket integration

---

## 📚 Documentation

- 📖 **[Feature Documentation](./ENHANCED_FEATURES_SUMMARY.md)** - Comprehensive feature overview
- 🔐 **[Access Control Guide](./ACCESS_CONTROL_GUIDE.md)** - Security and permissions
- 🔗 **[Integration Guide](./INTEGRATION_FEATURES.md)** - API and third-party integrations
- ⚡ **[Quick Setup](./QUICK_SETUP.md)** - Fast deployment guide

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your enhancements
4. Add tests for new features
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎉 Enhanced FleetFlow Summary

FleetFlow is now a **professional-grade fleet management platform** featuring:

✅ **Complete Invoice Automation**  
✅ **Advanced Analytics & Business Intelligence**  
✅ **Professional Email Communication**  
✅ **Modern UI/UX Design**  
✅ **Scalable Architecture**  
✅ **Enterprise-Ready Features**  

**Ready for production deployment with sophisticated financial tracking and automation capabilities.**

---

<div align="center">
  <h3>🚛 Built for the future of fleet management</h3>
  <p><strong>FleetFlow - Enhanced Edition</strong></p>
</div>
