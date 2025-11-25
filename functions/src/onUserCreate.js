const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { sendWelcomeEmail } = require('./emailService');

/**
 * Triggered when a new user signs up
 * - Creates user document in Firestore
 * - Sends welcome email
 */
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    const { uid, email, displayName, photoURL } = user;

    console.log(`New user created: ${email}`);

    // Create user document in Firestore
    await admin.firestore().collection('users').doc(uid).set({
      email,
      displayName: displayName || '',
      photoURL: photoURL || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      projectsCount: 0
    });

    // Send welcome email
    try {
      await sendWelcomeEmail({
        email,
        displayName: displayName || 'there'
      });
      console.log(`Welcome email sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the function if email fails
    }

    return { success: true, uid };
  } catch (error) {
    console.error('Error in onUserCreate:', error);
    return { success: false, error: error.message };
  }
});
