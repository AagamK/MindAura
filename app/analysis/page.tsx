"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowLeft, FileText, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"

interface AnalysisHistory {
  id: string
  date: string
  overallMood: string
  moodScore: number
  keyThemes: string[]
  riskLevel: "low" | "medium" | "high"
}

export default function AnalysisPage() {
  const [analysisHistory] = useState<AnalysisHistory[]>([
    {
      id: "1",
      date: "2024-01-15",
      overallMood: "Positive",
      moodScore: 78,
      keyThemes: ["Work/Career", "Relationships"],
      riskLevel: "low",
    },
    {
      id: "2",
      date: "2024-01-12",
      overallMood: "Challenging",
      moodScore: 45,
      keyThemes: ["Anxiety", "Sleep", "Work/Career"],
      riskLevel: "medium",
    },
    {
      id: "3",
      date: "2024-01-10",
      overallMood: "Neutral",
      moodScore: 62,
      keyThemes: ["General Wellbeing", "Family"],
      riskLevel: "low",
    },
  ])

  const averageScore = Math.round(
    analysisHistory.reduce((sum, analysis) => sum + analysis.moodScore, 0) / analysisHistory.length,
  )
  const trend = analysisHistory.length > 1 ? analysisHistory[0].moodScore - analysisHistory[1].moodScore : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Analysis History</span>
            </div>
          </div>
          <Button asChild>
            <Link href="/chat">New Analysis</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Wellness</CardTitle>
              <Brain className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{averageScore}%</div>
              <Progress value={averageScore} className="mt-2" />
              <p className="text-xs text-gray-500 mt-2">Based on {analysisHistory.length} analyses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Trend</CardTitle>
              <TrendingUp className={`h-4 w-4 ${trend >= 0 ? "text-green-600" : "text-red-600"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {trend >= 0 ? "+" : ""}
                {trend}%
              </div>
              <p className="text-xs text-gray-500 mt-2">Since last analysis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Low</div>
              <p className="text-xs text-gray-500 mt-2">Current risk level</p>
            </CardContent>
          </Card>
        </div>

        {/* Analysis History */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>Your mental wellness analysis over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisHistory.map((analysis) => (
                <div key={analysis.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(analysis.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <Badge
                        variant={
                          analysis.riskLevel === "high"
                            ? "destructive"
                            : analysis.riskLevel === "medium"
                              ? "secondary"
                              : "default"
                        }
                        className="text-xs"
                      >
                        {analysis.riskLevel} risk
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600">{analysis.moodScore}%</div>
                      <div className="text-xs text-gray-500">{analysis.overallMood}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Progress value={analysis.moodScore} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {analysis.keyThemes.map((theme, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-blue-50">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {analysisHistory.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
                <p className="text-gray-600 mb-4">Start a chat session to generate your first analysis</p>
                <Button asChild>
                  <Link href="/chat">Start Chatting</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Insights Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Most Common Themes</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Work/Career</span>
                    <span className="text-xs text-gray-500">67%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Anxiety</span>
                    <span className="text-xs text-gray-500">33%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Relationships</span>
                    <span className="text-xs text-gray-500">33%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Continue regular self-check-ins</li>
                  <li>• Practice stress management techniques</li>
                  <li>• Maintain work-life balance</li>
                  <li>• Consider professional support if needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
