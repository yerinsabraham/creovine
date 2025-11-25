# Firebase Functions Setup Guide

## ✅ What's Been Created

Complete backend infrastructure is now ready! Here's what you have:

### Functions Created:
1. **onProjectSubmit** - Auto-triggers when project submitted
2. **sendEmail** - Manual email sending
3. **createStripeCheckout** - Stripe payment initialization
4. **createPaystackCheckout** - Paystack payment initialization
5. **verifyPaystackPayment** - Paystack verification
6. **onUserCreate** - Welcome emails for new users
7. **updateProjectStatus** - Admin project status updates

### File Structure:
```
functions/
├── index.js                    (Main entry point)
├── package.json               (Dependencies)
├── .env.example              (Template for environment variables)
├── README.md                 (Full documentation)
└── src/
    ├── config.js             (Centralized configuration)
    ├── emailService.js       (EmailJS integration)
    ├── onProjectSubmit.js    (Project submission handler)
    ├── sendEmail.js          (Manual email function)
    ├── stripe.js             (Stripe payment integration)
    ├── paystack.js           (Paystack payment integration)
    ├── onUserCreate.js       (New user handler)
    └── updateProjectStatus.js (Admin status updates)
```

## 🔧 Configuration Needed (When Ready)

### 1. EmailJS Setup

**Go to:** https://www.emailjs.com/

**Steps:**
1. Create free account
2. Add email service (Gmail, Outlook, etc.)
3. Create 2 email templates:

**Template 1: Admin Notification**
- Name: "New Project Submission"
- Include variables: `{{projectName}}`, `{{clientName}}`, `{{clientEmail}}`, `{{totalAmount}}`, `{{appType}}`

**Template 2: Client Confirmation**
- Name: "Project Submission Confirmed"
- Include variables: `{{projectName}}`, `{{clientName}}`, `{{totalAmount}}`

4. Copy these values to `.env`:
   - Service ID
   - Template ID (Admin)
   - Template ID (Client)
   - User ID (Public Key)

### 2. Stripe Setup

**Go to:** https://stripe.com/

**Steps:**
1. Create account
2. Go to Developers → API Keys
3. Copy:
   - Secret Key (sk_test_...)
   - Publishable Key (pk_test_...)
4. Set up webhook:
   - URL: `https://us-central1-creovine.cloudfunctions.net/stripeWebhook`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy Webhook Secret

### 3. Paystack Setup

**Go to:** https://paystack.com/

**Steps:**
1. Create account
2. Go to Settings → API Keys & Webhooks
3. Copy:
   - Secret Key (sk_test_...)
   - Public Key (pk_test_...)
4. Set up webhook:
   - URL: `https://us-central1-creovine.cloudfunctions.net/paystackWebhook`
   - Copy Webhook Secret

## 📝 Environment Variables Template

Create `functions/.env` with:

```env
# EmailJS
EMAILJS_SERVICE_ID=service_xxxxxxx
EMAILJS_TEMPLATE_ID_ADMIN=template_xxxxxxx
EMAILJS_TEMPLATE_ID_CLIENT=template_xxxxxxx
EMAILJS_USER_ID=user_xxxxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxx

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxx

# Admin
ADMIN_EMAIL=your-email@creovine.com
ADMIN_UID=your_firebase_uid

# App
APP_URL=https://creovine.web.app
```

## 🚀 Deployment Commands

### Test Locally First:
```bash
cd functions
npm run serve
```

### Deploy to Production:
```bash
# From project root
firebase deploy --only functions

# Or from functions folder
npm run deploy
```

## 💡 How It Works Now

### When User Submits Project:

1. **Frontend** saves to Firestore `/projects/{id}`
2. **onProjectSubmit** function auto-triggers
3. Validates data & calculates cart total (server-side, can't be hacked)
4. Sends email to YOU (admin) with all project details
5. Sends confirmation email to USER
6. Creates admin notification in dashboard
7. Updates project with timestamp & status

### When User Wants to Pay:

**Option 1: Stripe** (International)
```javascript
const { createStripeCheckout } = getFunctions();
const result = await createStripeCheckout({
  projectId: 'xxx',
  cartItems: [...],
  successUrl: '...',
  cancelUrl: '...'
});
// Redirect user to result.url
```

**Option 2: Paystack** (Africa-focused)
```javascript
const { createPaystackCheckout } = getFunctions();
const result = await createPaystackCheckout({
  projectId: 'xxx',
  cartItems: [...],
  email: 'user@example.com'
});
// Redirect user to result.authorizationUrl
```

## 🔒 Security Features

✅ All amounts calculated server-side (users can't manipulate prices)
✅ Authentication required for all functions
✅ Admin-only functions check `isAdmin` flag
✅ Payment webhooks verify signatures
✅ Email templates prevent injection

## 📧 Email Template Examples

### Admin Notification Email:
```
Subject: New Project: {{projectName}}

Hi Admin,

A new project has been submitted!

Client: {{clientName}}
Email: {{clientEmail}}
App Type: {{appType}}
Total Amount: ${{totalAmount}}

Project Details:
[Link to dashboard]

Review and contact the client to get started!
```

### Client Confirmation Email:
```
Subject: Project Submitted Successfully!

Hi {{clientName}},

Thank you for submitting your project "{{projectName}}"!

Total Investment: ${{totalAmount}}

What's Next:
1. Our team will review your requirements within 24 hours
2. You'll receive a detailed proposal and timeline
3. Once approved, we'll start building immediately!

Questions? Reply to this email.

Best,
Creovine Team
```

## 🧪 Testing Checklist

Before going live:

- [ ] Test project submission (check if emails arrive)
- [ ] Test Stripe payment flow (use test card 4242 4242 4242 4242)
- [ ] Test Paystack payment (if using)
- [ ] Test admin status updates
- [ ] Verify webhook endpoints are working
- [ ] Check Firestore security rules
- [ ] Test on mobile devices

## 🆘 Common Issues

**Functions won't deploy:**
```bash
# Make sure you're in the right directory
cd c:\Users\PC\creovine
firebase deploy --only functions
```

**Emails not sending:**
- Check EmailJS dashboard for errors
- Verify template IDs match
- Check spam folder
- Test EmailJS directly on their website first

**Payments failing:**
- Verify you're using TEST keys, not live keys
- Check Stripe/Paystack dashboard for errors
- Ensure webhooks are configured

## 📞 Next Steps When Ready

1. **Set up EmailJS account** → Add credentials to `.env`
2. **Deploy functions:** `firebase deploy --only functions`
3. **Test project submission** → Check if emails arrive
4. **Set up Stripe** → When ready to accept payments
5. **Set up Paystack** → If targeting African market

Everything is ready to plug in credentials and deploy! 🎉

---

**Need help?** All documentation is in `functions/README.md`
