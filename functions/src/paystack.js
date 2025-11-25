const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const config = require('./config');

/**
 * Create Paystack Payment Initialization
 * Paystack is popular in Africa for payments
 */
exports.createPaystackCheckout = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Check if Paystack is configured
  if (!config.paystack.secretKey) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Paystack is not configured. Please add PAYSTACK_SECRET_KEY to environment variables.'
    );
  }

  try {
    const { projectId, cartItems, email } = data;

    // Calculate total in kobo (Paystack uses kobo for NGN)
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);
    const amountInKobo = Math.round(totalAmount * 100); // Convert to kobo

    // Initialize Paystack transaction
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: email || context.auth.token.email,
        amount: amountInKobo,
        currency: 'NGN', // Nigerian Naira
        callback_url: `${config.app.url}/payment/verify`,
        metadata: {
          projectId,
          userId: context.auth.uid,
          cartItems: JSON.stringify(cartItems)
        }
      },
      {
        headers: {
          Authorization: `Bearer ${config.paystack.secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { reference, authorization_url, access_code } = response.data.data;

    // Store payment reference
    await admin.firestore().collection('payments').add({
      userId: context.auth.uid,
      projectId,
      provider: 'paystack',
      reference,
      accessCode: access_code,
      amount: totalAmount,
      currency: 'NGN',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      reference,
      authorizationUrl: authorization_url,
      accessCode: access_code
    };

  } catch (error) {
    console.error('Error creating Paystack checkout:', error.response?.data || error.message);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Verify Paystack Payment
 * Called after user completes payment
 */
exports.verifyPaystackPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  if (!config.paystack.secretKey) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Paystack is not configured'
    );
  }

  try {
    const { reference } = data;

    // Verify transaction with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${config.paystack.secretKey}`
        }
      }
    );

    const verificationData = response.data.data;

    if (verificationData.status === 'success') {
      // Update payment status
      const paymentQuery = await admin.firestore()
        .collection('payments')
        .where('reference', '==', reference)
        .limit(1)
        .get();

      if (!paymentQuery.empty) {
        const paymentDoc = paymentQuery.docs[0];
        await paymentDoc.ref.update({
          status: 'completed',
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
          verificationData: {
            amount: verificationData.amount,
            currency: verificationData.currency,
            paidAt: verificationData.paid_at
          }
        });

        // Update project payment status
        const paymentData = paymentDoc.data();
        if (paymentData.projectId) {
          await admin.firestore()
            .collection('projects')
            .doc(paymentData.projectId)
            .update({
              paymentStatus: 'paid',
              paymentProvider: 'paystack',
              paidAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        return {
          success: true,
          status: 'completed',
          amount: verificationData.amount / 100 // Convert from kobo
        };
      }
    }

    return {
      success: false,
      status: verificationData.status
    };

  } catch (error) {
    console.error('Error verifying Paystack payment:', error.response?.data || error.message);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Paystack Webhook Handler
 * Listens for payment events from Paystack
 */
exports.paystackWebhook = functions.https.onRequest(async (req, res) => {
  if (!config.paystack.secretKey) {
    res.status(400).send('Paystack not configured');
    return;
  }

  // Verify webhook signature
  const hash = req.headers['x-paystack-signature'];
  // TODO: Implement signature verification when you get webhook secret from Paystack

  const event = req.body;

  switch (event.event) {
    case 'charge.success':
      const data = event.data;
      
      // Update payment record
      const paymentQuery = await admin.firestore()
        .collection('payments')
        .where('reference', '==', data.reference)
        .limit(1)
        .get();

      if (!paymentQuery.empty) {
        await paymentQuery.docs[0].ref.update({
          status: 'completed',
          paidAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      break;

    default:
      console.log(`Unhandled Paystack event: ${event.event}`);
  }

  res.json({ received: true });
});
