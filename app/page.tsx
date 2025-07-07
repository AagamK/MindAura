"use client"

import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Brain,
  MessageCircle,
  BarChart3,
  Shield,
  Sparkles,
  Heart,
  Users,
  Award,
  ArrowRight,
  Star,
  User,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useEffect, useState, useCallback } from "react"
import { db } from "@/lib/firebase"
  import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, doc } from "firebase/firestore"

export function useChat() {
  const { firebaseUser } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseUser) return
    const q = query(
      collection(db, "chats", firebaseUser.uid, "messages"),
      orderBy("createdAt", "asc")
    )
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    return unsub
  }, [firebaseUser])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!firebaseUser || !text.trim()) return
      await addDoc(collection(db, "chats", firebaseUser.uid, "messages"), {
        text,
        sender: "user",
        createdAt: Timestamp.now(),
      })
      // Optionally, trigger AI response here (call your AI API, then save response to Firestore)
    },
    [firebaseUser]
  )

  return { messages, sendMessage, loading }
}

export function useDashboard() {
  const { firebaseUser } = useAuth()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseUser) return
    const unsub = onSnapshot(doc(db, "users", firebaseUser.uid), (docSnap) => {
      setUserData(docSnap.data())
      setLoading(false)
    })
    return unsub
  }, [firebaseUser])

  return { userData, loading }
}

export default function HomePage() {
  const { isLoggedIn, user, logout, isLoading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <header className="border-b border-indigo-100 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="h-8 w-8 text-indigo-600" />
              <Sparkles className="h-3 w-3 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">MindAura</span>
              <p className="text-xs text-gray-500 -mt-1">AI-Powered Mental Wellness</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Features
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              About
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Stories
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Button asChild variant="outline" className="border-indigo-200 hover:bg-indigo-50 bg-transparent">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Welcome, {user?.name}</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                disabled={isLoading}
              >
                <Link href="/auth">Get Started</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 to-purple-100/20 rounded-3xl -z-10"></div>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 text-sm font-semibold">
              ✨ AI-Powered Mental Wellness
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Your Mind Deserves
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
              Compassionate Care
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Experience personalized mental health support with our advanced AI companion. Get instant, empathetic
            responses, detailed wellness insights, and professional-grade analysis—available 24/7 in a safe, private
            space.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl"
            >
              <Link href="/chat" className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {isLoggedIn ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-indigo-200 hover:bg-indigo-50 bg-transparent"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  View Dashboard
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-indigo-200 hover:bg-indigo-50 bg-transparent"
                disabled={isLoading}
              >
                <Link href="/auth">Create Free Account</Link>
              </Button>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>10k+ Lives Supported</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span>Clinically Validated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Advanced AI Mental Wellness Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Combining cutting-edge artificial intelligence with evidence-based therapeutic approaches to provide
              personalized mental health support that adapts to your unique needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Companion Chat</h3>
                <p className="text-gray-600 leading-relaxed">
                  Engage in natural, empathetic conversations with our advanced AI trained specifically for mental
                  health support. Available 24/7 with instant, personalized responses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-green-50 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Intelligent Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get comprehensive insights into your mental health patterns with AI-powered analysis. Track mood
                  trends, identify triggers, and receive personalized recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Privacy & Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your mental health data is protected with enterprise-grade encryption and HIPAA compliance. Complete
                  privacy with no data sharing or third-party access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* New Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transforming Lives Every Day</h2>
            <p className="text-xl text-gray-600">Real stories from our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah M.",
                role: "College Student",
                content:
                  "MindAura helped me through my anxiety during finals week. The AI really understood what I was going through and gave me practical coping strategies.",
                rating: 5,
              },
              {
                name: "David L.",
                role: "Working Professional",
                content:
                  "Having 24/7 access to mental health support has been life-changing. The analysis feature helped me identify patterns I never noticed before.",
                rating: 5,
              },
              {
                name: "Maria R.",
                role: "New Parent",
                content:
                  "As a new mom dealing with postpartum challenges, MindAura provided the support I needed when I couldn't get to therapy appointments.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Mental Health Support Reimagined</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  1 in 4 people experience mental health challenges, yet access to quality care remains limited.
                  MindAura bridges this gap with AI-powered support that's always available, completely private, and
                  clinically informed.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Heart className="h-3 w-3 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Always Available</h3>
                      <p className="text-gray-600">
                        No appointments needed. Get support whenever you need it, day or night.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Brain className="h-3 w-3 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Evidence-Based</h3>
                      <p className="text-gray-600">
                        Our AI is trained on proven therapeutic techniques and mental health research.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="h-3 w-3 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Personalized Care</h3>
                      <p className="text-gray-600">
                        Every interaction is tailored to your unique needs and mental health journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 text-center">
                  <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">MindAura AI</p>
                        <p className="text-xs text-gray-500">Your wellness companion</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-left">
                      "I understand you're feeling overwhelmed. Let's work through this together. What's been weighing
                      on your mind the most today?"
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold mb-2">🧠 Advanced AI Technology</p>
                    <p>Powered by state-of-the-art language models trained specifically for mental health support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Mental Wellness?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands who have found support, clarity, and growth through MindAura. Your journey to better mental
            health starts with a single conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-4 bg-white text-indigo-600 hover:bg-gray-100 shadow-xl"
            >
              <Link href="/chat" className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Start Free Chat Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {!isLoggedIn && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-indigo-600 bg-transparent"
                disabled={isLoading}
              >
                <Link href="/auth">Create Your Account</Link>
              </Button>
            )}
          </div>
          <p className="text-indigo-200 mt-6 text-sm">
            ✨ Free to start • No credit card required • Complete privacy guaranteed
          </p>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-4 flex flex-col md:flex-row justify-center items-center gap-12 text-center">
              <div>
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <Brain className="h-6 w-6 text-indigo-400" />
                  <span className="text-xl font-bold">MindAura</span>
                </div>
                <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
                  AI-powered mental wellness platform providing compassionate, accessible mental health support for everyone.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/chat" className="hover:text-white transition-colors">
                      AI Chat
                    </Link>
                  </li>
                  <li>
                    <Link href="/analysis" className="hover:text-white transition-colors">
                      Wellness Analysis
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-white transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources" className="hover:text-white transition-colors">
                      Resources
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/crisis" className="hover:text-white transition-colors">
                    Crisis Resources
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div> */}
            {/* <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/hipaa" className="hover:text-white transition-colors">
                    HIPAA Compliance
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
            <div className="border-t border-gray-800 pt-8 flex flex-row justify-end items-center">
            <p className="text-gray-400 text-sm text-right">© 2025 MindAura. Empowering mental wellness through AI technology.</p>
            </div>
        </div>
      </footer>
    </div>
  )
}
