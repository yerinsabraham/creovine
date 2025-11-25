const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// Import function modules
const { onProjectSubmit } = require('./src/onProjectSubmit');
const { sendEmail } = require('./src/sendEmail');
const { createStripeCheckout } = require('./src/stripe');
const { createPaystackCheckout, verifyPaystackPayment } = require('./src/paystack');
const { onUserCreate } = require('./src/onUserCreate');
const { updateProjectStatus } = require('./src/updateProjectStatus');

// Export functions
exports.onProjectSubmit = onProjectSubmit;
exports.sendEmail = sendEmail;
exports.createStripeCheckout = createStripeCheckout;
exports.createPaystackCheckout = createPaystackCheckout;
exports.verifyPaystackPayment = verifyPaystackPayment;
exports.onUserCreate = onUserCreate;
exports.updateProjectStatus = updateProjectStatus;
