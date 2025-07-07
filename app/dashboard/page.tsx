"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  ArrowLeft,
  TrendingUp,
  Calendar,
  MessageCircle,
  BarChart3,
  Activity,
  Clock,
  Target,
  Sparkles,
  Heart,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, isLoggedIn, getUserStats, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/auth")
      return
    }

    if (isLoggedIn) {
      loadStats()
    }
  }, [isLoggedIn, authLoading, router])

  const loadStats = async () => {
    try {
      const userStats = await getUserStats()
      setStats(userStats)
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Real-time updates every 30 seconds
  useEffect(() => {
    if (!isLoggedIn) return

    const interval = setInterval(() => {
      loadStats()
    }, 30000)

    return () => clearInterval(interval)
  }, [isLoggedIn])

  if (authLoading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wellness dashboard...</p>
        </div>
      </div>
    )
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥"
    if (streak >= 14) return "⭐"
    if (streak >= 7) return "💪"
    if (streak >= 3) return "🌟"
    return "✨"
  }

  const getMoodTrend = () => {
    if (stats.weeklyProgress.length < 2) return { trend: "stable", change: 0 }
    const recent = stats.weeklyProgress.slice(-3).reduce((a: number, b: number) => a + b, 0) / 3
    const previous = stats.weeklyProgress.slice(-6, -3).reduce((a: number, b: number) => a + b, 0) / 3
    const change = recent - previous

    if (change > 5) return { trend: "improving", change: Math.round(change) }
    if (change < -5) return { trend: "declining", change: Math.round(Math.abs(change)) }
    return { trend: "stable", change: 0 }
  }

  const moodTrend = getMoodTrend()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <header className="border-b border-indigo-100 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="hover:bg-indigo-50">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-7 w-7 text-indigo-600" />
                <Sparkles className="h-3 w-3 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-lg">MindAura Dashboard</span>
                <p className="text-xs text-gray-500 -mt-1">Real-time Wellness Insights</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Link href="/chat">New Chat Session</Link>
            </Button>
            <div className="text-sm text-gray-600">
              <p className="font-medium">Welcome back, {user?.name}!</p>
              <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section with Real-time Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
                {user?.name}!{getStreakEmoji(stats.currentStreak)}
              </h1>
              <p className="text-gray-600 text-lg">Here's your real-time mental wellness journey progress.</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">Live Dashboard</span>
              </div>
              <p className="text-xs text-gray-500">Updates every 30 seconds</p>
            </div>
          </div>

          {/* Mood Trend Alert */}
          {moodTrend.trend !== "stable" && (
            <div
              className={`p-4 rounded-xl border ${
                moodTrend.trend === "improving" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp
                  className={`h-5 w-5 ${moodTrend.trend === "improving" ? "text-green-600" : "text-yellow-600"}`}
                />
                <span
                  className={`font-medium ${moodTrend.trend === "improving" ? "text-green-800" : "text-yellow-800"}`}
                >
                  Your wellness trend is {moodTrend.trend} by {moodTrend.change}% this week
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Current Wellness</CardTitle>
              <div className="relative">
                <Heart className="h-5 w-5 text-blue-600" />
                {stats.wellnessScore > 70 && <Sparkles className="h-2 w-2 text-yellow-500 absolute -top-1 -right-1" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.wellnessScore}%</div>
              <Progress value={stats.wellnessScore} className="mb-2" />
              <p className="text-xs text-gray-600">
                {stats.wellnessScore > 80
                  ? "Excellent"
                  : stats.wellnessScore > 60
                    ? "Good"
                    : stats.wellnessScore > 40
                      ? "Fair"
                      : "Needs attention"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Active Streak</CardTitle>
              <Calendar className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {stats.currentStreak} {getStreakEmoji(stats.currentStreak)}
              </div>
              <p className="text-xs text-gray-600">
                {stats.currentStreak === 0
                  ? "Start your journey today!"
                  : stats.currentStreak === 1
                    ? "Great start!"
                    : stats.currentStreak < 7
                      ? "Building momentum"
                      : stats.currentStreak < 30
                        ? "Amazing consistency!"
                        : "Incredible dedication!"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Chat Sessions</CardTitle>
              <MessageCircle className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalSessions}</div>
              <p className="text-xs text-gray-600">{stats.totalMessages} total messages</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Avg Session</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.averageSessionLength}m</div>
              <p className="text-xs text-gray-600">
                {stats.averageSessionLength > 20
                  ? "Deep conversations"
                  : stats.averageSessionLength > 10
                    ? "Good engagement"
                    : "Quick check-ins"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Enhanced Weekly Progress */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                Weekly Wellness Journey
              </CardTitle>
              <CardDescription>Your emotional wellness scores over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.weeklyProgress.map((score: number, index: number) => {
                  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                  const isToday = index === stats.weeklyProgress.length - 1
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-2 rounded-lg ${isToday ? "bg-indigo-50 border border-indigo-200" : ""}`}
                    >
                      <span className={`text-sm font-medium w-12 ${isToday ? "text-indigo-700" : "text-gray-700"}`}>
                        {isToday ? "Today" : days[index]}
                      </span>
                      <Progress value={score} className="flex-1" />
                      <span
                        className={`text-sm w-12 text-right ${isToday ? "text-indigo-700 font-bold" : "text-gray-600"}`}
                      >
                        {score}%
                      </span>
                      {isToday && <Zap className="h-4 w-4 text-indigo-600" />}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Recent Sessions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest chat sessions and wellness interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentSessions.length > 0 ? (
                  stats.recentSessions.map((session: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            session.mood === "positive" || session.mood === "Good" || session.mood === "Great"
                              ? "bg-green-500"
                              : session.mood === "neutral" || session.mood === "Okay"
                                ? "bg-yellow-500"
                                : session.mood === "challenging" || session.mood === "Not great"
                                  ? "bg-red-500"
                                  : "bg-gray-400"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{session.date}</p>
                          <p className="text-xs text-gray-600">
                            {session.messages} messages • {session.mood}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{session.duration}</p>
                        <Badge variant="outline" className="text-xs">
                          {session.messages > 10 ? "Deep" : session.messages > 5 ? "Good" : "Brief"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No recent sessions yet</p>
                    <Button asChild size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600">
                      <Link href="/chat">Start Your First Chat</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              Continue Your Wellness Journey
            </CardTitle>
            <CardDescription>Take action to improve your mental health today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button
                asChild
                className="h-auto p-6 flex-col gap-3 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Link href="/chat">
                  <MessageCircle className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Start Chat</div>
                    <div className="text-xs opacity-90">Express your thoughts</div>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-6 flex-col gap-3 border-emerald-200 hover:bg-emerald-50 bg-transparent"
              >
                <Link href="/analysis">
                  <BarChart3 className="h-8 w-8 text-emerald-600" />
                  <div className="text-center">
                    <div className="font-semibold text-emerald-700">View Analysis</div>
                    <div className="text-xs text-emerald-600">Track your progress</div>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-6 flex-col gap-3 border-purple-200 hover:bg-purple-50 bg-transparent"
              >
                <Link href="/mood-tracker">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="text-center">
                    <div className="font-semibold text-purple-700">Mood Check</div>
                    <div className="text-xs text-purple-600">Quick wellness update</div>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-6 flex-col gap-3 border-orange-200 hover:bg-orange-50 bg-transparent"
              >
                <Link href="/resources">
                  <Brain className="h-8 w-8 text-orange-600" />
                  <div className="text-center">
                    <div className="font-semibold text-orange-700">Resources</div>
                    <div className="text-xs text-orange-600">Helpful tools & tips</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wellness Tips Based on Current State */}
        <Card className="mt-8 border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">Personalized Wellness Tip</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {stats.wellnessScore > 80
                ? "You're doing amazing! Consider sharing your positive energy by helping others or practicing gratitude to maintain this wonderful state."
                : stats.wellnessScore > 60
                  ? "You're on a good path! Try incorporating 5 minutes of deep breathing or a short walk to boost your wellness even further."
                  : stats.wellnessScore > 40
                    ? "Every step counts! Consider reaching out to a friend, practicing self-compassion, or engaging in a favorite hobby today."
                    : "You're taking important steps by being here. Remember that seeking support is a sign of strength. Consider professional help if you're struggling."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
