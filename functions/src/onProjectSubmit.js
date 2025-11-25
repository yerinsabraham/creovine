const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { sendProjectSubmissionEmails } = require('./emailService');

/**
 * Triggered when a project is submitted (Firestore write to /projects)
 * - Validates project data
 * - Calculates final total
 * - Sends email notifications
 * - Updates project status
 */
exports.onProjectSubmit = functions.firestore
  .document('projects/{projectId}')
  .onCreate(async (snap, context) => {
    try {
      const projectData = snap.data();
      const projectId = context.params.projectId;

      console.log(`New project submitted: ${projectId}`);

      // Get user details
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(projectData.userId)
        .get();
      
      const userData = userDoc.data();

      // Calculate cart total from cart items
      const cartTotal = projectData.cartItems
        ? projectData.cartItems.reduce((sum, item) => sum + (item.price || 0), 0)
        : 0;

      // Validate and update project with server-calculated total
      await snap.ref.update({
        totalAmount: cartTotal,
        status: 'pending',
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });

      // Send email notifications
      try {
        await sendProjectSubmissionEmails({
          projectId,
          projectData: {
            ...projectData,
            totalAmount: cartTotal
          },
          userData: {
            email: userData?.email || projectData.userEmail,
            displayName: userData?.displayName || 'Client'
          }
        });
        console.log(`Emails sent for project ${projectId}`);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the function if email fails
      }

      // Create admin notification
      await admin.firestore().collection('adminNotifications').add({
        type: 'new_project',
        projectId,
        userId: projectData.userId,
        userEmail: userData?.email || projectData.userEmail,
        totalAmount: cartTotal,
        message: `New project submission: ${projectData.vision?.projectName || 'Unnamed Project'}`,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Project ${projectId} processed successfully`);
      return { success: true, projectId, totalAmount: cartTotal };

    } catch (error) {
      console.error('Error processing project submission:', error);
      throw new functions.https.HttpsError('internal', error.message);
    }
  });
