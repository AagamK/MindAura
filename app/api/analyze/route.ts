export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const conversationText = messages
      .map((msg: any) => msg.content)
      .join(" ")
      .toLowerCase()

    // Enhanced analysis logic
    const analysis = generateDetailedAnalysis(conversationText, messages)

    return Response.json(analysis)
  } catch (error) {
    console.error("Analysis API error:", error)
    return new Response("Error analyzing conversation", { status: 500 })
  }
}

function generateDetailedAnalysis(text: string, messages: any[]) {
  // Enhanced keyword analysis
  const positiveWords = [
    "happy",
    "good",
    "great",
    "better",
    "excited",
    "grateful",
    "love",
    "amazing",
    "wonderful",
    "fantastic",
    "excellent",
    "pleased",
    "content",
    "joyful",
    "optimistic",
    "hopeful",
    "confident",
    "proud",
    "satisfied",
    "peaceful",
    "calm",
    "relaxed",
    "energetic",
    "motivated",
    "accomplished",
  ]

  const negativeWords = [
    "sad",
    "depressed",
    "anxious",
    "worried",
    "stressed",
    "tired",
    "angry",
    "frustrated",
    "overwhelmed",
    "hopeless",
    "lonely",
    "scared",
    "afraid",
    "panic",
    "exhausted",
    "worthless",
    "guilty",
    "ashamed",
    "disappointed",
    "hurt",
    "broken",
    "empty",
    "numb",
    "isolated",
    "desperate",
  ]

  const crisisWords = [
    "suicide",
    "kill myself",
    "end it all",
    "want to die",
    "hurt myself",
    "self harm",
    "no point",
    "give up",
    "can't go on",
    "better off dead",
    "end the pain",
    "not worth living",
  ]

  const anxietyWords = [
    "anxious",
    "worry",
    "panic",
    "nervous",
    "stress",
    "overwhelmed",
    "racing thoughts",
    "can't breathe",
    "heart racing",
    "restless",
  ]

  const depressionWords = [
    "sad",
    "depressed",
    "hopeless",
    "empty",
    "worthless",
    "tired",
    "no energy",
    "can't sleep",
    "don't care",
    "numb",
  ]

  // Count occurrences
  const positiveCount = positiveWords.filter((word) => text.includes(word)).length
  const negativeCount = negativeWords.filter((word) => text.includes(word)).length
  const crisisCount = crisisWords.filter((word) => text.includes(word)).length
  const anxietyCount = anxietyWords.filter((word) => text.includes(word)).length
  const depressionCount = depressionWords.filter((word) => text.includes(word)).length

  // Determine overall mood and score
  let overallMood = "Neutral"
  let moodScore = 50
  let riskLevel: "low" | "medium" | "high" = "low"
  let needsProfessionalHelp = false

  if (crisisCount > 0) {
    overallMood = "Crisis"
    moodScore = Math.max(10, 25 - crisisCount * 5)
    riskLevel = "high"
    needsProfessionalHelp = true
  } else if (negativeCount > positiveCount + 3) {
    overallMood = "Struggling"
    moodScore = Math.max(15, 35 - negativeCount * 2)
    riskLevel = negativeCount > 8 ? "high" : "medium"
    needsProfessionalHelp = negativeCount > 6
  } else if (negativeCount > positiveCount) {
    overallMood = "Challenging"
    moodScore = Math.max(25, 45 - negativeCount * 1.5)
    riskLevel = negativeCount > 5 ? "medium" : "low"
  } else if (positiveCount > negativeCount + 2) {
    overallMood = "Positive"
    moodScore = Math.min(95, 70 + positiveCount * 2)
  } else if (positiveCount > negativeCount) {
    overallMood = "Improving"
    moodScore = Math.min(85, 60 + positiveCount * 1.5)
  }

  // Identify key themes
  const themes = []
  if (text.includes("work") || text.includes("job") || text.includes("career") || text.includes("boss")) {
    themes.push("Work/Career")
  }
  if (text.includes("family") || text.includes("parent") || text.includes("mother") || text.includes("father")) {
    themes.push("Family")
  }
  if (
    text.includes("relationship") ||
    text.includes("partner") ||
    text.includes("boyfriend") ||
    text.includes("girlfriend")
  ) {
    themes.push("Relationships")
  }
  if (text.includes("sleep") || text.includes("tired") || text.includes("insomnia") || text.includes("exhausted")) {
    themes.push("Sleep & Energy")
  }
  if (anxietyCount > 0) {
    themes.push("Anxiety")
  }
  if (depressionCount > 0) {
    themes.push("Depression")
  }
  if (text.includes("money") || text.includes("financial") || text.includes("debt") || text.includes("bills")) {
    themes.push("Financial Stress")
  }
  if (text.includes("health") || text.includes("sick") || text.includes("pain") || text.includes("medical")) {
    themes.push("Health Concerns")
  }
  if (text.includes("school") || text.includes("college") || text.includes("university") || text.includes("student")) {
    themes.push("Education/School")
  }

  // Generate insights
  const insights = []
  insights.push(`Your conversation reflects a ${overallMood.toLowerCase()} emotional state`)
  insights.push(`You've discussed ${themes.length || 1} main areas of concern`)
  insights.push(
    `Your engagement level appears ${messages.length > 8 ? "high" : messages.length > 4 ? "moderate" : "initial"}`,
  )

  if (crisisCount > 0) {
    insights.push("You've expressed some very serious concerns that require immediate attention")
  } else if (negativeCount > 5) {
    insights.push("You're experiencing significant emotional challenges that may benefit from additional support")
  } else if (positiveCount > negativeCount) {
    insights.push("You're showing positive coping strategies and resilience")
  }

  if (anxietyCount > 2) {
    insights.push("Anxiety appears to be a significant factor in your current experience")
  }
  if (depressionCount > 2) {
    insights.push("You're experiencing symptoms that align with depressive feelings")
  }

  // Generate recommendations
  const recommendations = []

  if (needsProfessionalHelp) {
    recommendations.push("Please consider speaking with a mental health professional immediately")
    if (crisisCount > 0) {
      recommendations.push("Contact a crisis helpline (988) if you're having thoughts of self-harm")
    }
    recommendations.push("Reach out to trusted friends or family members for support")
  } else {
    recommendations.push("Continue regular check-ins with yourself about your mental health")

    if (themes.includes("Anxiety")) {
      recommendations.push("Practice deep breathing exercises and mindfulness techniques")
      recommendations.push("Consider limiting caffeine and establishing calming routines")
    }

    if (themes.includes("Sleep & Energy")) {
      recommendations.push("Establish a consistent sleep schedule and bedtime routine")
      recommendations.push("Limit screen time before bed and create a restful environment")
    }

    if (themes.includes("Work/Career")) {
      recommendations.push("Consider work-life balance strategies and boundary setting")
      recommendations.push("Explore stress management techniques for workplace challenges")
    }

    if (themes.includes("Relationships")) {
      recommendations.push("Practice open communication and consider couples/family counseling if needed")
    }

    recommendations.push("Maintain healthy social connections and support systems")
    recommendations.push("Engage in regular physical activity and self-care practices")

    if (riskLevel === "medium") {
      recommendations.push("Consider speaking with a counselor or therapist for additional support")
    }
  }

  return {
    overallMood,
    moodScore,
    keyThemes: themes.length > 0 ? themes : ["General Wellbeing"],
    insights,
    recommendations,
    riskLevel,
    needsProfessionalHelp,
  }
}
