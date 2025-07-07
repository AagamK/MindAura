import { initializeApp } from "firebase/app"
import { initializeAuth, browserLocalPersistence, type Auth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Explicitly register and create the Auth provider **before** it’s used elsewhere
export const auth: Auth = initializeAuth(app, {
  persistence: typeof window !== "undefined" ? browserLocalPersistence : undefined,
})

// Firestore
export const db = getFirestore(app)

export default app
