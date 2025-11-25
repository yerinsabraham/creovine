const axios = require('axios');
const config = require('./config');

/**
 * Send emails using EmailJS
 * EmailJS allows sending emails without a backend server
 * Set up your EmailJS account and configure templates
 */

/**
 * Send email via EmailJS
 * @param {Object} params - Email parameters
 * @param {string} templateId - EmailJS template ID
 */
async function sendEmailViaEmailJS(params, templateId) {
  // Check if EmailJS is configured
  if (!config.emailjs.serviceId || !config.emailjs.userId) {
    console.log('EmailJS not configured. Skipping email send.');
    console.log('Email would contain:', params);
    return { success: false, reason: 'not_configured' };
  }

  try {
    const response = await axios.post(
      'https://api.emailjs.com/api/v1.0/email/send',
      {
        service_id: config.emailjs.serviceId,
        template_id: templateId,
        user_id: config.emailjs.userId,
        template_params: params
      }
    );

    console.log('Email sent successfully via EmailJS');
    return { success: true, response: response.data };
  } catch (error) {
    console.error('EmailJS send error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Send project submission notification emails
 * - Admin notification email
 * - Client confirmation email
 */
async function sendProjectSubmissionEmails({ projectId, projectData, userData }) {
  try {
    // Prepare email data
    const emailData = {
      projectId,
      projectName: projectData.vision?.projectName || 'Unnamed Project',
      clientName: userData.displayName || 'Client',
      clientEmail: userData.email,
      totalAmount: projectData.totalAmount || 0,
      appType: projectData.vision?.appType || 'Not specified',
      submittedDate: new Date().toLocaleDateString(),
      dashboardUrl: `${config.app.url}/admin`,
      
      // Cart items summary
      cartItems: projectData.cartItems || [],
      cartItemsCount: projectData.cartItems?.length || 0,
      
      // Phase summaries
      phases: {
        vision: projectData.vision,
        users: projectData.users,
        functionality: projectData.functionality,
        backend: projectData.backend,
        identity: projectData.identity,
        deployment: projectData.deployment
      }
    };

    // Send admin notification email
    await sendEmailViaEmailJS(
      {
        ...emailData,
        to_email: config.admin.email,
        to_name: 'Creovine Admin',
        subject: `New Project: ${emailData.projectName}`,
        message_type: 'admin_notification'
      },
      config.emailjs.templateIdAdmin
    );

    // Send client confirmation email
    await sendEmailViaEmailJS(
      {
        ...emailData,
        to_email: userData.email,
        to_name: userData.displayName,
        subject: `Project Submitted: ${emailData.projectName}`,
        message_type: 'client_confirmation'
      },
      config.emailjs.templateIdClient
    );

    return { success: true };
  } catch (error) {
    console.error('Error sending project submission emails:', error);
    throw error;
  }
}

/**
 * Send project status update email to client
 */
async function sendStatusUpdateEmail({ projectId, clientEmail, clientName, status, message }) {
  if (!config.emailjs.serviceId) {
    console.log('EmailJS not configured. Status update email skipped.');
    return { success: false, reason: 'not_configured' };
  }

  try {
    await sendEmailViaEmailJS(
      {
        to_email: clientEmail,
        to_name: clientName,
        projectId,
        status,
        message,
        subject: `Project Update: ${status}`,
        dashboardUrl: `${config.app.url}/onboarding`
      },
      config.emailjs.templateIdClient
    );

    return { success: true };
  } catch (error) {
    console.error('Error sending status update email:', error);
    throw error;
  }
}

/**
 * Send welcome email to new user
 */
async function sendWelcomeEmail({ email, displayName }) {
  if (!config.emailjs.serviceId) {
    console.log('EmailJS not configured. Welcome email skipped.');
    return { success: false, reason: 'not_configured' };
  }

  try {
    await sendEmailViaEmailJS(
      {
        to_email: email,
        to_name: displayName,
        subject: 'Welcome to Creovine!',
        message_type: 'welcome',
        dashboardUrl: `${config.app.url}/onboarding`
      },
      config.emailjs.templateIdClient
    );

    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

module.exports = {
  sendProjectSubmissionEmails,
  sendStatusUpdateEmail,
  sendWelcomeEmail
};
