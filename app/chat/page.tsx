"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Brain,
  Send,
  User,
  Bot,
  ArrowLeft,
  FileText,
  AlertTriangle,
  Phone,
  Sparkles,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"

interface AnalysisResult {
  overallMood: string
  moodScore: number
  keyThemes: string[]
  insights: string[]
  recommendations: string[]
  riskLevel: "low" | "medium" | "high"
  needsProfessionalHelp: boolean
}

export default function ChatPage() {
  const { isLoggedIn, updateActivity } = useAuth()
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm MindAura, your AI wellness companion. I'm here to provide a safe, judgment-free space where you can share what's on your mind. How are you feeling today? 🌟",
      },
    ],
    onError: () => {
      console.log("Chat processing...")
    },
    onFinish: () => {
      // Track user activity
      updateActivity({
        type: "chat_message",
        timestamp: new Date(),
        data: { messageCount: messages.length },
      })
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showCrisisHelp, setShowCrisisHelp] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [typingIndicator, setTypingIndicator] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Monitor for crisis keywords
  useEffect(() => {
    const userMessages = messages.filter((m) => m.role === "user")
    if (userMessages.length > 0) {
      const lastMessage = userMessages[userMessages.length - 1].content.toLowerCase()
      const crisisKeywords = ["suicide", "kill myself", "end it all", "want to die", "hurt myself", "self harm"]

      if (crisisKeywords.some((keyword) => lastMessage.includes(keyword))) {
        setShowCrisisHelp(true)
      }
    }
  }, [messages])

  // Show typing indicator when AI is responding
  useEffect(() => {
    setTypingIndicator(isLoading)
  }, [isLoading])

  const analyzeConversation = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true)
      return
    }

    const userMessages = messages.filter((m) => m.role === "user")

    if (userMessages.length < 2) {
      alert("Please have a longer conversation before analyzing.")
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: userMessages }),
      })

      if (response.ok) {
        const analysis = await response.json()
        setAnalysisResult(analysis)
        setShowAnalysis(true)

        // Track analysis activity
        updateActivity({
          type: "analysis",
          timestamp: new Date(),
          data: {
            mood: analysis.overallMood.toLowerCase(),
            moodScore: analysis.moodScore,
          },
        })
      }
    } catch (error) {
      console.error("Analysis error:", error)
    }

    setIsAnalyzing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const formatMessageContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Crisis Help Banner */}
      {showCrisisHelp && (
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              <span className="font-medium">🆘 If you're in crisis, immediate help is available</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="tel:988"
                className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call 988 Now
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCrisisHelp(false)}
                className="text-white hover:bg-white/20 rounded-full"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Header */}
      <header className="border-b border-indigo-100 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="hover:bg-indigo-50">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-7 w-7 text-indigo-600" />
                <Sparkles className="h-3 w-3 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-lg">MindAura</span>
                <p className="text-xs text-gray-500 -mt-1">AI Wellness Companion</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={analyzeConversation}
              disabled={isAnalyzing || messages.filter((m) => m.role === "user").length < 2}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
              size="sm"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  AI Analysis
                </>
              )}
            </Button>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">AI Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Chat Container */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="h-[calc(100vh-220px)] flex flex-col shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                      : "bg-white border border-gray-100"
                  }`}
                >
                  <div className={`text-sm leading-relaxed ${message.role === "assistant" ? "text-gray-800" : ""}`}>
                    {formatMessageContent(message.content)}
                  </div>
                  <p className={`text-xs mt-3 ${message.role === "user" ? "text-indigo-100" : "text-gray-400"}`}>
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Enhanced Typing Indicator */}
            {typingIndicator && (
              <div className="flex gap-4 justify-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">MindAura is thinking</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Enhanced Input */}
          <div className="border-t border-gray-100 p-6 bg-gray-50/50">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind... I'm here to listen and support you 💙"
                  className="flex-1 min-h-[70px] resize-none border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 bg-white shadow-sm"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="lg"
                  className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500">
                🔒 Your conversations are private and secure. Crisis support: <strong>Call 988</strong>
              </p>
              <p className="text-xs text-gray-400">Press Enter to send • Shift+Enter for new line</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
                <p className="text-gray-600">
                  To access AI-powered analysis and save your progress, please sign in to your MindAura account.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Link href="/auth">Sign In / Create Account</Link>
                </Button>
                <Button variant="outline" onClick={() => setShowLoginPrompt(false)} className="w-full">
                  Continue Chatting
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                You can continue chatting without signing in, but analysis features require an account.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Analysis Modal */}
      {showAnalysis && analysisResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <Card className="w-full max-w-3xl max-h-[85vh] overflow-y-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Wellness Analysis</h2>
                    <p className="text-gray-600">Personalized insights from your conversation</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnalysis(false)}
                  className="text-gray-500 hover:text-gray-700 rounded-full"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-8">
                {/* Crisis Warning */}
                {analysisResult.needsProfessionalHelp && (
                  <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                      <h3 className="font-bold text-red-800 text-lg">Professional Support Recommended</h3>
                    </div>
                    <p className="text-red-700">
                      Based on our conversation, I strongly encourage you to speak with a mental health professional.
                      You don't have to go through this alone. 💙
                    </p>
                  </div>
                )}

                {/* Mood Score */}
                <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Current Emotional State</h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    {analysisResult.overallMood}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all duration-1000 ${
                        analysisResult.moodScore < 30
                          ? "bg-gradient-to-r from-red-400 to-red-600"
                          : analysisResult.moodScore < 60
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                            : "bg-gradient-to-r from-green-400 to-emerald-600"
                      }`}
                      style={{ width: `${analysisResult.moodScore}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-600 font-medium">Wellness Score: {analysisResult.moodScore}/100</p>
                </div>

                {/* Risk Level */}
                <div className="flex items-center justify-center">
                  <Badge
                    variant={
                      analysisResult.riskLevel === "high"
                        ? "destructive"
                        : analysisResult.riskLevel === "medium"
                          ? "secondary"
                          : "default"
                    }
                    className="text-base px-6 py-2 font-semibold"
                  >
                    Support Level: {analysisResult.riskLevel.toUpperCase()}
                  </Badge>
                </div>

                {/* Key Themes */}
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">What We Discussed</h3>
                  <div className="flex flex-wrap gap-3">
                    {analysisResult.keyThemes.map((theme, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-indigo-50 border-indigo-200 text-indigo-700 px-4 py-2"
                      >
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Insights & Recommendations Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      Key Insights
                    </h3>
                    <ul className="space-y-3">
                      {analysisResult.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <Button
                    onClick={() => setShowAnalysis(false)}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Continue Chatting
                  </Button>
                  <Button variant="outline" className="flex-1 border-indigo-200 hover:bg-indigo-50 bg-transparent">
                    Save Analysis
                  </Button>
                </div>

                {/* Enhanced Disclaimer */}
                <div className="text-sm text-gray-500 text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="leading-relaxed">
                    💡 This AI analysis is for informational purposes and personal reflection. It should not replace
                    professional mental health advice. If you're experiencing severe distress, please contact a mental
                    health professional or crisis helpline immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
