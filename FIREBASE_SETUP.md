# Firebase Setup Instructions

Follow these steps to configure Firebase for the Creovine platform.

## Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. You should already be logged in to your Firebase account
3. Select your project or create a new one
4. Click on the gear icon (Settings) → Project settings
5. Scroll down to "Your apps" section
6. If you haven't added a web app yet:
   - Click the `</>` (Web) icon
   - Register your app with a nickname (e.g., "Creovine Web")
   - Copy the configuration object

## Step 2: Create .env File

1. In the root of your project, create a file named `.env`
2. Copy the values from your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get Started**
2. Click on **Sign-in method** tab
3. Enable **Google**:
   - Click on Google
   - Toggle "Enable"
   - Set a project support email
   - Save
4. Enable **Email/Password**:
   - Click on Email/Password
   - Toggle "Enable" for Email/Password (first option)
   - Save

## Step 4: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** → **Create database**
2. Choose **Production mode** (we'll add security rules next)
3. Select your database location (choose closest to your users)
4. Click **Enable**

## Step 5: Deploy Firestore Security Rules

1. Open terminal in your project directory
2. Install Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```
3. Login to Firebase:
   ```bash
   firebase login
   ```
4. Initialize Firebase:
   ```bash
   firebase init
   ```
   - Select **Firestore** and **Storage**
   - Choose your existing project
   - Accept default file names (firestore.rules, storage.rules)
5. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

## Step 6: Create Storage Bucket

1. In Firebase Console, go to **Storage** → **Get Started**
2. Start in **Production mode**
3. Choose your storage location
4. Click **Done**

## Step 7: Verify Setup

1. Start your dev server:
   ```bash
   npm run dev
   ```
2. Open http://localhost:5173
3. Try signing up with Google or Email/Password
4. Check Firebase Console:
   - Authentication → Users (should see your account)
   - Firestore Database → Data (should see `users` collection)

## Troubleshooting

### "Firebase not configured" error
- Make sure your `.env` file exists and has all the required variables
- Restart the dev server after creating `.env`

### Google Sign-In not working
- Check that you've enabled Google in Authentication settings
- Verify the support email is set

### "Permission denied" errors in Firestore
- Deploy the security rules: `firebase deploy --only firestore:rules`
- Check that rules allow authenticated users to access their own data

### Storage upload fails
- Deploy storage rules: `firebase deploy --only storage:rules`
- Verify Storage is enabled in Firebase Console

## Security Notes

The security rules we've set up ensure:
- Users can only read/write their own data in the `users` collection
- Users can only access their own projects in the `projects` collection
- Users can only upload files to their own folder in Storage

## Next Steps

Once Firebase is configured:
1. Test the complete onboarding flow
2. Verify data is being saved to Firestore
3. Test file uploads to Storage
4. Check that auto-save is working

For production deployment, see the main README.md file.
