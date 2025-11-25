# Creovine Platform

An interactive platform that collects comprehensive app requirements through a beautiful, chip-based onboarding flow.

## 🚀 Features

- **Interactive Onboarding**: 6-phase chip-based interface for gathering requirements
- **Firebase Integration**: Authentication, Firestore database, and Storage
- **Beautiful UI**: Tailwind CSS with custom color palette and Framer Motion animations
- **Real-time Auto-save**: Progress automatically saved to Firestore
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Protected Routes**: Secure authentication flow with Google and Email/Password

## 📦 Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State Management**: React Context API
- **Icons**: React Icons
- **Confetti**: Canvas Confetti

## 🛠️ Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication (Google and Email/Password)
4. Create a Firestore database
5. Create a Storage bucket
6. Copy your Firebase config

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

### 4. Deploy Firebase Security Rules

```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 📁 Project Structure

```
creovine/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   ├── common/          # Reusable components (Chip, Button, Modal, etc.)
│   │   ├── landing/         # Landing page components
│   │   └── onboarding/      # Onboarding flow components
│   │       └── phases/      # Individual phase components
│   ├── config/
│   │   └── firebase.js      # Firebase configuration
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── ProjectContext.jsx # Project data state
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── OnboardingDashboard.jsx
│   │   └── SuccessPage.jsx
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── firestore.rules
├── storage.rules
├── tailwind.config.js
├── package.json
└── README.md
```

## 🎨 Design System

### Colors
- **Dark Background**: `#0B1F30`
- **Background**: `#15293A`
- **Popup**: `#214055`
- **Green**: `#29BD98`
- **Blue**: `#2497F9`
- **Text Secondary**: `#658CA7`
- **Dark Gray**: `#466E8A`
- **Light Gray**: `#9FBBCD`

### Typography
- Font Family: Poppins
- Weights: 300, 400, 500, 600, 700

## 🔐 Security

- Firestore and Storage rules ensure users can only access their own data
- Protected routes require authentication
- Input validation on client and server side
- File upload size and type restrictions

## 📱 6 Onboarding Phases

1. **Identity & Design**: Brand name, logo upload, color palette
2. **Frontend Experience**: App type, style preference, page structure
3. **Backend & Logic**: Backend architecture, database, authentication
4. **Accounts & Access**: GitHub integration
5. **App Features**: Pre-built features selection, custom features
6. **Additional Support**: Optional services and submission

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

## 📝 License

MIT
