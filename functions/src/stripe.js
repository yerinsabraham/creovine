const functions = require('firebase-functions');
const admin = require('firebase-admin');
const config = require('./config');

// Initialize Stripe only if configured
let stripe = null;
if (config.stripe.secretKey) {
  stripe = require('stripe')(config.stripe.secretKey);
}

/**
 * Create Stripe Checkout Session
 * Called from frontend to initiate payment
 */
exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Check if Stripe is configured
  if (!stripe) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.'
    );
  }

  try {
    const { projectId, cartItems, successUrl, cancelUrl } = data;

    // Validate cart items and calculate total
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.label,
          description: item.description,
          metadata: {
            category: item.category
          }
        },
        unit_amount: Math.round(item.price * 100) // Convert to cents
      },
      quantity: 1
    }));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${config.app.url}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${config.app.url}/onboarding`,
      metadata: {
        projectId,
        userId: context.auth.uid
      },
      customer_email: context.auth.token.email
    });

    // Store payment intent info
    await admin.firestore().collection('payments').add({
      userId: context.auth.uid,
      projectId,
      provider: 'stripe',
      sessionId: session.id,
      amount: cartItems.reduce((sum, item) => sum + item.price, 0),
      currency: 'usd',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      sessionId: session.id,
      url: session.url
    };

  } catch (error) {
    console.error('Error creating Stripe checkout:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Stripe Webhook Handler
 * Listens for payment confirmations
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  if (!stripe) {
    res.status(400).send('Stripe not configured');
    return;
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      config.stripe.webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Update payment status
      const paymentQuery = await admin.firestore()
        .collection('payments')
        .where('sessionId', '==', session.id)
        .limit(1)
        .get();

      if (!paymentQuery.empty) {
        await paymentQuery.docs[0].ref.update({
          status: 'completed',
          paidAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Update project payment status
        const projectId = session.metadata.projectId;
        if (projectId) {
          await admin.firestore()
            .collection('projects')
            .doc(projectId)
            .update({
              paymentStatus: 'paid',
              paymentProvider: 'stripe',
              paidAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }
      }
      break;

    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});
