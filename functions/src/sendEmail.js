const functions = require('firebase-functions');
const { sendStatusUpdateEmail } = require('./emailService');

/**
 * Callable function to send custom emails
 * Can be called from frontend for manual email triggers
 */
exports.sendEmail = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to send emails'
    );
  }

  try {
    const { type, recipientEmail, recipientName, projectId, status, message } = data;

    if (type === 'status_update') {
      await sendStatusUpdateEmail({
        projectId,
        clientEmail: recipientEmail,
        clientName: recipientName,
        status,
        message
      });
    }

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error in sendEmail function:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
