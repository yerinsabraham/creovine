const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { sendStatusUpdateEmail } = require('./emailService');

/**
 * Callable function for admin to update project status
 * Sends email notification to client
 */
exports.updateProjectStatus = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated and is admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Check if user is admin
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(context.auth.uid)
    .get();

  if (!userDoc.exists || !userDoc.data().isAdmin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can update project status'
    );
  }

  try {
    const { projectId, status, message } = data;

    // Valid statuses
    const validStatuses = [
      'pending',
      'in_progress',
      'ready_for_review',
      'revisions_needed',
      'completed',
      'cancelled'
    ];

    if (!validStatuses.includes(status)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      );
    }

    // Get project data
    const projectDoc = await admin.firestore()
      .collection('projects')
      .doc(projectId)
      .get();

    if (!projectDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Project not found'
      );
    }

    const projectData = projectDoc.data();

    // Update project status
    await projectDoc.ref.update({
      status,
      statusMessage: message || '',
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: context.auth.uid
    });

    // Add to status history
    await projectDoc.ref.collection('statusHistory').add({
      status,
      message: message || '',
      updatedBy: context.auth.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Get user info for email
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(projectData.userId)
      .get();

    const userData = userDoc.data();

    // Send email notification to client
    try {
      await sendStatusUpdateEmail({
        projectId,
        clientEmail: userData.email,
        clientName: userData.displayName || 'Client',
        status,
        message: message || `Your project status has been updated to: ${status}`
      });
      console.log(`Status update email sent for project ${projectId}`);
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // Don't fail the function if email fails
    }

    return {
      success: true,
      projectId,
      status,
      message: 'Project status updated successfully'
    };

  } catch (error) {
    console.error('Error updating project status:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
