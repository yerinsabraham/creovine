# Creovine Firebase Functions

Backend cloud functions for Creovine app platform.

## Features

- **✅ Project Submission Handler** - Validates and processes project submissions
- **✅ Email Notifications** - EmailJS integration for automated emails
- **✅ Payment Processing** - Stripe & Paystack integration
- **✅ User Management** - Welcome emails and user document creation
- **✅ Admin Functions** - Project status updates and notifications

## Setup Instructions

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**EmailJS Setup:**
1. Go to https://www.emailjs.com/
2. Create account and service
3. Create email templates (admin notification + client confirmation)
4. Copy Service ID, Template IDs, and User ID to `.env`

**Stripe Setup:**
1. Go to https://stripe.com/
2. Get API keys from Dashboard
3. Add to `.env`

**Paystack Setup:**
1. Go to https://paystack.com/
2. Get API keys from Settings
3. Add to `.env`

### 3. Set Firebase Environment Config

```bash
# From project root
firebase functions:config:set \
  emailjs.service_id="your_service_id" \
  emailjs.template_id_admin="admin_template" \
  emailjs.template_id_client="client_template" \
  emailjs.user_id="your_user_id"

firebase functions:config:set \
  stripe.secret_key="sk_test_..." \
  stripe.webhook_secret="whsec_..."

firebase functions:config:set \
  paystack.secret_key="sk_test_..." \
  paystack.public_key="pk_test_..."
```

### 4. Deploy Functions

```bash
# Deploy all functions
npm run deploy

# Or from project root
firebase deploy --only functions
```

## Available Functions

### 1. `onProjectSubmit` (Trigger)
- **Trigger:** Firestore onCreate `/projects/{projectId}`
- **Purpose:** Processes new project submissions
- **Actions:**
  - Validates project data
  - Calculates cart total
  - Sends admin notification email
  - Sends client confirmation email
  - Creates admin notification document

### 2. `sendEmail` (Callable)
- **Type:** HTTPS Callable
- **Purpose:** Send custom emails from frontend
- **Parameters:**
  ```javascript
  {
    type: 'status_update',
    recipientEmail: 'user@example.com',
    recipientName: 'John Doe',
    projectId: 'project123',
    status: 'in_progress',
    message: 'We have started working on your project'
  }
  ```

### 3. `createStripeCheckout` (Callable)
- **Type:** HTTPS Callable
- **Purpose:** Create Stripe payment session
- **Parameters:**
  ```javascript
  {
    projectId: 'project123',
    cartItems: [...],
    successUrl: 'https://...',
    cancelUrl: 'https://...'
  }
  ```
- **Returns:** `{ sessionId, url }`

### 4. `createPaystackCheckout` (Callable)
- **Type:** HTTPS Callable
- **Purpose:** Initialize Paystack payment
- **Parameters:**
  ```javascript
  {
    projectId: 'project123',
    cartItems: [...],
    email: 'user@example.com'
  }
  ```
- **Returns:** `{ reference, authorizationUrl, accessCode }`

### 5. `verifyPaystackPayment` (Callable)
- **Type:** HTTPS Callable
- **Purpose:** Verify Paystack payment after completion
- **Parameters:**
  ```javascript
  {
    reference: 'paystack_reference'
  }
  ```

### 6. `onUserCreate` (Trigger)
- **Trigger:** Auth onCreate
- **Purpose:** Process new user signups
- **Actions:**
  - Creates user document in Firestore
  - Sends welcome email

### 7. `updateProjectStatus` (Callable - Admin Only)
- **Type:** HTTPS Callable
- **Purpose:** Admin updates project status
- **Parameters:**
  ```javascript
  {
    projectId: 'project123',
    status: 'in_progress',
    message: 'Started development'
  }
  ```
- **Valid Statuses:**
  - `pending`
  - `in_progress`
  - `ready_for_review`
  - `revisions_needed`
  - `completed`
  - `cancelled`

## Local Development

### Test Functions Locally

```bash
# Start emulator
npm run serve

# Functions will run at http://localhost:5001
```

### View Logs

```bash
# Real-time logs
npm run logs

# Or
firebase functions:log
```

## EmailJS Template Variables

### Admin Notification Template
```
- projectId
- projectName
- clientName
- clientEmail
- totalAmount
- appType
- submittedDate
- dashboardUrl
- cartItems (array)
- phases (object with all phase data)
```

### Client Confirmation Template
```
- projectName
- clientName
- totalAmount
- submittedDate
- cartItems (array)
- message_type
```

## Security

- All callable functions verify authentication
- Admin-only functions check `isAdmin` flag in user document
- Payment amounts are validated server-side
- Webhook signatures are verified (Stripe & Paystack)

## Troubleshooting

**Functions not deploying?**
```bash
# Check Node version (must be 18)
node --version

# Reinstall dependencies
cd functions
rm -rf node_modules
npm install
```

**Emails not sending?**
- Check EmailJS configuration
- Verify template IDs are correct
- Check EmailJS dashboard for errors
- Test with emulator first

**Payments failing?**
- Verify API keys are correct (test vs production)
- Check Stripe/Paystack dashboard for errors
- Ensure webhook URLs are configured correctly

## Next Steps

1. Set up EmailJS templates with proper variables
2. Configure Stripe webhook endpoint: `https://yourproject.cloudfunctions.net/stripeWebhook`
3. Configure Paystack webhook endpoint: `https://yourproject.cloudfunctions.net/paystackWebhook`
4. Test all functions in emulator before deploying
5. Deploy to production: `firebase deploy --only functions`

## Support

For issues, contact admin@creovine.com
