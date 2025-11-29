# Admin Messaging System - How to Send Messages to Users

## Firestore Collection Structure

Collection: `user_messages`

## Message Document Fields:

```javascript
{
  userId: "user_uid_here",              // Required
  subject: "Payment Request",            // Required
  message: "Full message body...",       // Required
  type: "payment",                       // payment | info-request | progress | completion | alert
  preview: "Short preview text...",      // Optional - for message list
  read: false,                          // Boolean - default false
  readAt: null,                         // Timestamp - set when user reads
  createdAt: serverTimestamp(),        // Required
  
  // Optional fields for specific message types
  paymentLink: "https://checkout.stripe.com/...",  // For payment type
  actionLink: "https://...",            // For other types  
  actionLabel: "View Details",          // Button text for actionLink
  projectId: "project_id_here",        // Associated project
  projectName: "User's Project Name"   // For reference
}
```

## Example Messages:

### 1. Payment Request
```javascript
await addDoc(collection(db, 'user_messages'), {
  userId: "abc123",
  subject: "Payment Required - Final Quote Ready",
  message: "Hi John! We've completed the quote for your project 'My App'. The total is $8,500.\n\nPlease review and make payment to begin development. Click the button below to proceed securely via Stripe.",
  preview: "Final quote ready: $8,500 - Payment required to begin",
  type: "payment",
  paymentLink: "https://checkout.stripe.com/c/pay/cs_test_xxx",
  projectId: "user_submitted_123",
  projectName: "My App",
  read: false,
  createdAt: serverTimestamp()
});
```

### 2. Information Request
```javascript
await addDoc(collection(db, 'user_messages'), {
  userId: "abc123",
  subject: "Additional Information Needed",
  message: "Hi Sarah! We're working on your landing page and need some additional details:\n\n1. Do you have a preferred color scheme?\n2. Can you provide your logo in SVG format?\n3. What's your target completion date?\n\nPlease reply via chat or email us at support@creovine.com",
  preview: "We need some additional details about your landing page",
  type: "info-request",
  projectId: "user_submitted_456",
  projectName: "Company Website",
  read: false,
  createdAt: serverTimestamp()
});
```

### 3. Progress Update
```javascript
await addDoc(collection(db, 'user_messages'), {
  userId: "abc123",
  subject: "Great Progress - 50% Complete!",
  message: "Exciting news! Your project is now 50% complete.\n\nCompleted:\n✅ Database design\n✅ Authentication system\n✅ User dashboard\n\nNext steps:\n⏳ Payment integration\n⏳ Admin panel\n⏳ Final testing\n\nStay tuned for more updates!",
  preview: "Your project is 50% complete - major milestones reached!",
  type: "progress",
  projectId: "user_submitted_789",
  projectName: "E-commerce Platform",
  read: false,
  createdAt: serverTimestamp()
});
```

### 4. Project Completion
```javascript
await addDoc(collection(db, 'user_messages'), {
  userId: "abc123",
  subject: "🎉 Your Project is Complete!",
  message: "Congratulations! Your project 'My App' is now complete and ready for launch.\n\nWhat's included:\n✅ Full source code\n✅ Deployment on your chosen platform\n✅ Documentation\n✅ 30 days of free support\n\nClick below to access your project dashboard.",
  preview: "🎉 Your project is complete and ready to launch!",
  type: "completion",
  actionLink: "https://creovine.web.app/project/xyz/details",
  actionLabel: "View Project",
  projectId: "user_submitted_999",
  projectName: "My App",
  read: false,
  createdAt: serverTimestamp()
});
```

### 5. Important Alert
```javascript
await addDoc(collection(db, 'user_messages'), {
  userId: "abc123",
  subject: "Action Required - Domain Setup",
  message: "Your project is ready for deployment, but we need you to configure your custom domain.\n\nSteps:\n1. Log into your domain registrar\n2. Add these DNS records:\n   - CNAME: www → creovine.web.app\n   - A: @ → 192.0.2.1\n\nReply once complete so we can finalize deployment.",
  preview: "Domain configuration needed before deployment",
  type: "alert",
  projectId: "user_submitted_111",
  projectName: "Corporate Website",
  read: false,
  createdAt: serverTimestamp()
});
```

## How to Send from Admin Dashboard:

You can create an admin interface to send messages, or use Firebase Console directly:

1. Go to Firestore Database
2. Navigate to `user_messages` collection
3. Click "Add document"
4. Fill in the fields above
5. User will see notification instantly (real-time listener)

## Message Types & Icons:

- `payment` → 💰 (green)
- `info-request` → 📋 (blue)
- `progress` → ✅ (purple)
- `completion` → 🚀 (green)
- `alert` → ⚠️ (red)

## Best Practices:

1. Always include `userId`, `subject`, `message`, `type`, and `createdAt`
2. Keep preview under 100 characters
3. Use payment links for Stripe/Paystack checkout sessions
4. Include project context (projectId/projectName) when relevant
5. Write clear, actionable messages
6. Use appropriate message types for proper styling

The system automatically:
- Shows unread count badge in header
- Marks messages as read when opened
- Provides real-time notifications
- Organizes by date (newest first)
