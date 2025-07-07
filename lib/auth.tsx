"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./firebase"

interface User {
  id: string
  name: string
  email: string
  joinedDate: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  logout: () => Promise<void>
  updateActivity: (activity: UserActivity) => Promise<void>
  getUserStats: () => Promise<UserStats>
}

interface UserActivity {
  type: "chat_message" | "analysis" | "login" | "mood_check"
  timestamp: Date
  data?: any
}

interface UserStats {
  totalSessions: number
  totalMessages: number
  averageSessionLength: number
  currentStreak: number
  wellnessScore: number
  weeklyProgress: number[]
  recentSessions: Array<{
    date: string
    mood: string
    duration: string
    messages: number
  }>
  moodTrends: Array<{
    date: string
    score: number
    mood: string
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email || "",
          joinedDate: firebaseUser.metadata.creationTime || new Date().toISOString(),
          avatar: firebaseUser.photoURL || undefined,
        }

        setUser(userData)
        setFirebaseUser(firebaseUser)

        // Create or update user document in Firestore
        await createOrUpdateUserDocument(firebaseUser, userData)
      } else {
        // User is signed out
        setUser(null)
        setFirebaseUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const createOrUpdateUserDocument = async (firebaseUser: FirebaseUser, userData: User) => {
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userDocRef, {
          ...userData,
          activities: [],
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        })
      } else {
        // Update last login time
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error("Error creating/updating user document:", error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Add login activity
      await updateActivity({ type: "login", timestamp: new Date() })

      return true
    } catch (error: any) {
      console.error("Login error:", error)
      throw new Error(error.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: name,
      })

      // Add login activity
      await updateActivity({ type: "login", timestamp: new Date() })

      return true
    } catch (error: any) {
      console.error("Signup error:", error)
      throw new Error(error.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // Add login activity
      await updateActivity({ type: "login", timestamp: new Date() })

      return true
    } catch (error: any) {
      console.error("Google login error:", error)
      throw new Error(error.message || "Failed to sign in with Google")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  const updateActivity = async (activity: UserActivity): Promise<void> => {
    if (!firebaseUser) return

    try {
      const userDocRef = doc(db, "users", firebaseUser.uid)
      await updateDoc(userDocRef, {
        activities: arrayUnion({
          ...activity,
          timestamp: activity.timestamp.toISOString(),
        }),
      })
    } catch (error) {
      console.error("Error updating activity:", error)
    }
  }

  const getUserStats = async (): Promise<UserStats> => {
    if (!firebaseUser) {
      return {
        totalSessions: 0,
        totalMessages: 0,
        averageSessionLength: 0,
        currentStreak: 0,
        wellnessScore: 50,
        weeklyProgress: [50, 50, 50, 50, 50, 50, 50],
        recentSessions: [],
        moodTrends: [],
      }
    }

    try {
      const userDocRef = doc(db, "users", firebaseUser.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        return {
          totalSessions: 0,
          totalMessages: 0,
          averageSessionLength: 0,
          currentStreak: 0,
          wellnessScore: 50,
          weeklyProgress: [50, 50, 50, 50, 50, 50, 50],
          recentSessions: [],
          moodTrends: [],
        }
      }

      const userData = userDoc.data()
      const activities: UserActivity[] = (userData.activities || []).map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp),
      }))

      return calculateUserStats(activities)
    } catch (error) {
      console.error("Error getting user stats:", error)
      return {
        totalSessions: 0,
        totalMessages: 0,
        averageSessionLength: 0,
        currentStreak: 0,
        wellnessScore: 50,
        weeklyProgress: [50, 50, 50, 50, 50, 50, 50],
        recentSessions: [],
        moodTrends: [],
      }
    }
  }

  const calculateUserStats = (activities: UserActivity[]): UserStats => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Filter recent activities
    const recentActivities = activities.filter((a) => new Date(a.timestamp) >= oneWeekAgo)
    const chatSessions = recentActivities.filter((a) => a.type === "chat_message")
    const analyses = recentActivities.filter((a) => a.type === "analysis")

    // Calculate session data
    const sessionsByDay = new Map<string, { messages: number; startTime: Date; endTime: Date; mood?: string }>()

    chatSessions.forEach((activity) => {
      const dateKey = new Date(activity.timestamp).toDateString()
      if (!sessionsByDay.has(dateKey)) {
        sessionsByDay.set(dateKey, {
          messages: 0,
          startTime: new Date(activity.timestamp),
          endTime: new Date(activity.timestamp),
        })
      }
      const session = sessionsByDay.get(dateKey)!
      session.messages++
      session.endTime = new Date(activity.timestamp)
    })

    // Add mood data from analyses
    analyses.forEach((activity) => {
      const dateKey = new Date(activity.timestamp).toDateString()
      if (sessionsByDay.has(dateKey) && activity.data?.mood) {
        sessionsByDay.get(dateKey)!.mood = activity.data.mood
      }
    })

    // Calculate weekly progress (wellness scores)
    const weeklyProgress = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateKey = date.toDateString()
      const session = sessionsByDay.get(dateKey)

      // Calculate wellness score based on activity
      let score = 50 // baseline
      if (session) {
        score += Math.min(session.messages * 2, 30) // up to 30 points for engagement
        if (session.mood === "positive") score += 20
        else if (session.mood === "neutral") score += 10
        else if (session.mood === "challenging") score -= 10
      }
      weeklyProgress.push(Math.min(Math.max(score, 0), 100))
    }

    // Calculate current streak
    let currentStreak = 0
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateKey = date.toDateString()
      if (sessionsByDay.has(dateKey)) {
        currentStreak++
      } else {
        break
      }
    }

    // Recent sessions for display
    const recentSessions = Array.from(sessionsByDay.entries())
      .slice(-3)
      .map(([dateKey, session]) => {
        const date = new Date(dateKey)
        const duration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))
        return {
          date:
            date.toLocaleDateString() === now.toLocaleDateString()
              ? "Today"
              : date.toLocaleDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toLocaleDateString()
                ? "Yesterday"
                : date.toLocaleDateString(),
          mood: session.mood || "Not analyzed",
          duration: `${Math.max(duration, 1)} min`,
          messages: session.messages,
        }
      })
      .reverse()

    // Mood trends
    const moodTrends = analyses.slice(-7).map((activity) => ({
      date: new Date(activity.timestamp).toLocaleDateString(),
      score: activity.data?.moodScore || 50,
      mood: activity.data?.mood || "neutral",
    }))

    const totalSessions = sessionsByDay.size
    const totalMessages = chatSessions.length
    const averageSessionLength =
      totalSessions > 0
        ? Array.from(sessionsByDay.values()).reduce((sum, session) => {
            return sum + (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)
          }, 0) / totalSessions
        : 0

    const currentWellnessScore = weeklyProgress[weeklyProgress.length - 1] || 50

    return {
      totalSessions,
      totalMessages,
      averageSessionLength: Math.round(averageSessionLength),
      currentStreak,
      wellnessScore: currentWellnessScore,
      weeklyProgress,
      recentSessions,
      moodTrends,
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoggedIn: !!user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateActivity,
        getUserStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
