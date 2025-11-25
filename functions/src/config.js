// Configuration for Firebase Functions
// This file centralizes all environment variables and config

module.exports = {
  // EmailJS Config
  emailjs: {
    serviceId: process.env.EMAILJS_SERVICE_ID || '',
    templateIdAdmin: process.env.EMAILJS_TEMPLATE_ID_ADMIN || '',
    templateIdClient: process.env.EMAILJS_TEMPLATE_ID_CLIENT || '',
    userId: process.env.EMAILJS_USER_ID || ''
  },

  // Stripe Config
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
  },

  // Paystack Config
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || '',
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || ''
  },

  // Admin Config
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@creovine.com',
    uid: process.env.ADMIN_UID || ''
  },

  // App Config
  app: {
    url: process.env.APP_URL || 'https://creovine.web.app'
  }
};
