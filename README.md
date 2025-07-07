# MindAura - AI-Powered Mental Wellness Platform

Welcome to MindAura! This comprehensive guide will help you set up, run, and deploy your AI-powered mental wellness platform.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Firebase Configuration](#firebase-configuration)
4. [Environment Variables](#environment-variables)
5. [Installation & Running Locally](#installation--running-locally)
6. [Deploying to Vercel](#deploying-to-vercel)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Troubleshooting](#troubleshooting)
9. [Features Overview](#features-overview)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager (comes with Node.js)
- **Git** (optional, for version control) - [Download here](https://git-scm.com/)
- A **Google account** (for Firebase setup)
- A **Vercel account** (for deployment) - [Sign up here](https://vercel.com/)

### Verify Prerequisites

Open your terminal/command prompt and run:

\`\`\`bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show a version number
\`\`\`

## 🚀 Initial Setup

### Step 1: Extract the Project Files

1. **Unzip the downloaded file** to your desired location
2. **Navigate to the project directory** in your terminal:

\`\`\`bash
cd mindaura
\`\`\`

### Step 2: Install Dependencies

Run the following command to install all required packages:

\`\`\`bash
npm install
\`\`\`

This will install all dependencies listed in `package.json`, including:
- Next.js framework
- Firebase SDK
- UI components
- AI SDK
- And other required packages

## 🔥 Firebase Configuration

MindAura uses Firebase for authentication and data storage. Follow these steps to set up Firebase:

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `mindaura` (or your preferred name)
4. **Disable Google Analytics** (optional for this project)
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** → **Get started**
2. Go to **Sign-in method** tab
3. Enable the following providers:
   - **Email/Password**: Click → Enable → Save
   - **Google**: Click → Enable → Add your email → Save

### Step 3: Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** → Next
3. Select your preferred location → Done

### Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon) → **General** tab
2. Scroll down to **"Your apps"** section
3. Click **"Web app"** icon (`</>`)
4. Register app name: `mindaura-web`
5. **Copy the configuration object** - you'll need this for environment variables

The config will look like this:
\`\`\`javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
\`\`\`

### Step 5: Configure Firestore Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace the default rules with:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write their own data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

3. Click **"Publish"**

## 🔐 Environment Variables

### Step 1: Create Environment File

1. In your project root directory, create a file named `.env.local`
2. Copy the contents from the existing `.env.local` file
3. Replace the placeholder values with your actual Firebase configuration:

\`\`\`env
# Firebase Configuration - Replace with your actual values
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
\`\`\`

### Step 2: Update Firebase Configuration File

1. Open `lib/firebase.ts`
2. Replace the `firebaseConfig` object with your actual Firebase configuration:

\`\`\`typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}
\`\`\`

## 💻 Installation & Running Locally

### Step 1: Start Development Server

Run the following command to start the development server:

\`\`\`bash
npm run dev
\`\`\`

### Step 2: Access the Application

1. Open your browser and go to: `http://localhost:3000`
2. You should see the MindAura homepage
3. Test the authentication by creating an account
4. Try the chat functionality

### Step 3: Verify Everything Works

- ✅ Homepage loads correctly
- ✅ User registration/login works
- ✅ Chat interface is functional
- ✅ Dashboard displays user data
- ✅ No console errors in browser developer tools

## 🚀 Deploying to Vercel

### Step 1: Prepare for Deployment

1. Ensure all changes are saved
2. Test the application locally one more time
3. Make sure `.env.local` contains correct Firebase configuration

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI globally:
\`\`\`bash
npm install -g vercel
\`\`\`

2. Login to Vercel:
\`\`\`bash
vercel login
\`\`\`

3. Deploy the project:
\`\`\`bash
vercel
\`\`\`

4. Follow the prompts:
   - **Set up and deploy?** → Yes
   - **Which scope?** → Select your account
   - **Link to existing project?** → No
   - **Project name?** → `mindaura` (or your preferred name)
   - **Directory?** → `./` (current directory)
   - **Override settings?** → No

#### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. **Import Git Repository** or **Upload folder**
4. If uploading folder, select your project directory
5. Configure project:
   - **Project Name**: `mindaura`
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
6. Click **"Deploy"**

### Step 3: Configure Environment Variables on Vercel

1. Go to your project in Vercel Dashboard
2. Go to **Settings** → **Environment Variables**
3. Add each environment variable from your `.env.local` file:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY = your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID = your_actual_app_id
\`\`\`

4. Click **"Save"** for each variable

### Step 4: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for deployment to complete

## 🔧 Post-Deployment Configuration

### Step 1: Update Firebase Authorized Domains

1. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your Vercel deployment URL (e.g., `mindaura.vercel.app`)
3. Click **"Add domain"**

### Step 2: Test Production Deployment

1. Visit your deployed application URL
2. Test all functionality:
   - User registration/login
   - Chat functionality
   - Dashboard features
   - Data persistence

### Step 3: Custom Domain (Optional)

If you want to use a custom domain:

1. In Vercel Dashboard → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Firebase authorized domains with your custom domain

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Firebase Configuration Errors

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solution**: 
- Double-check your Firebase API key in `.env.local`
- Ensure environment variables are properly set in Vercel
- Verify Firebase project is active

#### 2. Authentication Not Working

**Error**: Users can't sign in/up

**Solution**:
- Check Firebase Authentication is enabled
- Verify authorized domains include your deployment URL
- Check browser console for specific error messages

#### 3. Firestore Permission Errors

**Error**: `Missing or insufficient permissions`

**Solution**:
- Update Firestore security rules as shown above
- Ensure user is properly authenticated
- Check Firebase project permissions

#### 4. Build Errors on Vercel

**Error**: Build fails during deployment

**Solution**:
- Check all dependencies are in `package.json`
- Ensure TypeScript errors are resolved
- Verify environment variables are set correctly

#### 5. Environment Variables Not Working

**Error**: `process.env.NEXT_PUBLIC_* is undefined`

**Solution**:
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding environment variables
- Check variable names match exactly

### Getting Help

If you encounter issues:

1. **Check the browser console** for error messages
2. **Review Vercel deployment logs** in the dashboard
3. **Verify Firebase configuration** in the console
4. **Test locally first** before deploying

## ✨ Features Overview

Your MindAura platform includes:

### 🤖 AI Chat Companion
- 24/7 AI-powered mental health support
- Empathetic, context-aware responses
- Crisis detection and support resources

### 📊 Wellness Analytics
- Real-time mood tracking
- Personalized insights and recommendations
- Progress visualization and trends

### 🔐 Secure Authentication
- Email/password and Google OAuth
- Secure user data with Firebase
- HIPAA-compliant privacy measures

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Modern, accessible interface
- Dark/light mode support

### 🎯 Dashboard Features
- Personal wellness metrics
- Activity tracking and streaks
- Customized recommendations

## 🎉 Congratulations!

You've successfully set up and deployed MindAura! Your AI-powered mental wellness platform is now ready to help users on their mental health journey.

### Next Steps

1. **Customize branding** - Update colors, logos, and content
2. **Add more features** - Implement additional wellness tools
3. **Monitor usage** - Use Firebase Analytics and Vercel Analytics
4. **Scale as needed** - Upgrade Firebase and Vercel plans when necessary

### Support

For technical support or questions about the platform, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

**Built with ❤️ for mental wellness**

*Remember: This platform provides supportive AI interactions but should not replace professional mental health care when needed.*
