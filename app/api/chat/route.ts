// Mock AI chat API that simulates realistic responses
export const maxDuration = 30

interface Message {
  role: "user" | "assistant"
  content: string
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const response = generateMindAuraResponse(lastMessage, messages)

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Simulate streaming by sending response word by word
        const words = response.split(" ")
        let index = 0

        const sendNextWord = () => {
          if (index < words.length) {
            const word = words[index] + (index < words.length - 1 ? " " : "")
            controller.enqueue(encoder.encode(`0:"${word}"\n`))
            index++
            setTimeout(sendNextWord, 50 + Math.random() * 100) // Random delay between words
          } else {
            controller.enqueue(encoder.encode("d\n")) // End stream
            controller.close()
          }
        }

        sendNextWord()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Error processing chat request", { status: 500 })
  }
}

function generateMindAuraResponse(userInput: string, conversationHistory: Message[]): string {
  // Analyze user input for emotional context
  const isFirstMessage = conversationHistory.filter((m) => m.role === "user").length <= 1

  // Crisis keywords detection
  const crisisKeywords = [
    "suicide",
    "kill myself",
    "end it all",
    "want to die",
    "hurt myself",
    "self harm",
    "no point living",
  ]
  const hasCrisisContent = crisisKeywords.some((keyword) => userInput.includes(keyword))

  if (hasCrisisContent) {
    return "I'm really concerned about what you're sharing with me. These feelings are incredibly difficult, and I want you to know that you don't have to face them alone. Please consider reaching out to a crisis counselor who can provide immediate support - you can call 988 for the Suicide & Crisis Lifeline. Your life has value, and there are people who want to help you through this difficult time. Can you tell me if you have someone you trust that you could reach out to right now?"
  }

  // Emotional keywords for response matching
  const anxietyWords = ["anxious", "worried", "panic", "nervous", "stress", "overwhelmed"]
  const depressionWords = ["sad", "depressed", "hopeless", "empty", "worthless", "tired"]
  const angerWords = ["angry", "frustrated", "mad", "irritated", "furious"]
  const positiveWords = ["good", "better", "happy", "great", "excited", "grateful"]

  const hasAnxiety = anxietyWords.some((word) => userInput.includes(word))
  const hasDepression = depressionWords.some((word) => userInput.includes(word))
  const hasAnger = angerWords.some((word) => userInput.includes(word))
  const hasPositive = positiveWords.some((word) => userInput.includes(word))

  // Context-aware responses
  if (isFirstMessage) {
    if (hasPositive) {
      return "I'm so glad to hear you're feeling good today! It's wonderful when we can recognize and appreciate those positive moments. What's been contributing to these good feelings? Sometimes understanding what helps us feel better can be really valuable for the future."
    } else if (hasAnxiety || hasDepression) {
      return "Thank you for sharing that with me - it takes courage to open up about difficult feelings. I want you to know that what you're experiencing is valid, and you're not alone in feeling this way. Can you tell me a bit more about what's been weighing on your mind lately?"
    } else {
      return "I appreciate you taking the time to connect today. Sometimes it can feel uncertain where to start when we're thinking about our mental health. There's no pressure - we can talk about whatever feels most important to you right now. What's been on your mind lately?"
    }
  }

  // Contextual responses based on emotional content
  if (hasAnxiety) {
    const anxietyResponses = [
      "Anxiety can feel so overwhelming, especially when our minds start racing with 'what if' thoughts. I hear that you're struggling with these worried feelings. When you notice anxiety building up, what does it feel like in your body? Sometimes paying attention to those physical sensations can help us understand our anxiety better.",
      "Those anxious feelings sound really difficult to manage. It's completely understandable that you're feeling overwhelmed. Have you noticed any particular situations or thoughts that tend to trigger these anxious feelings? Understanding our patterns can sometimes help us feel more in control.",
      "I can hear how much anxiety is affecting you right now. It's exhausting when our minds won't quiet down, isn't it? One thing that many people find helpful is focusing on what we can control in this moment. What's one small thing that usually helps you feel even slightly more grounded?",
    ]
    return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)]
  }

  if (hasDepression) {
    const depressionResponses = [
      "I hear the heaviness in what you're sharing, and I want you to know that these feelings of sadness and emptiness are real and valid. Depression can make everything feel so much harder, even simple daily tasks. You're showing strength by reaching out and talking about this. What has your energy been like lately?",
      "Thank you for trusting me with these difficult feelings. Depression can make us feel so isolated and hopeless, but please know that you're not alone in this experience. Even when it doesn't feel like it, you matter. Have you been able to do any small things for yourself lately, even tiny acts of self-care?",
      "I can sense how much you're struggling right now, and I'm glad you're here talking about it rather than keeping it all inside. Depression has a way of convincing us that things won't get better, but that's the depression talking, not the truth. What's one thing, however small, that used to bring you even a little bit of joy?",
    ]
    return depressionResponses[Math.floor(Math.random() * depressionResponses.length)]
  }

  if (hasAnger) {
    const angerResponses = [
      "I can hear the frustration and anger in what you're sharing. Those feelings are completely valid - anger often shows up when we feel hurt, unheard, or when our boundaries have been crossed. It sounds like you're dealing with something really challenging. What's been building up these feelings of anger for you?",
      "Anger can be such a powerful emotion, and it sounds like you're experiencing a lot of it right now. Sometimes anger is our way of protecting ourselves when we feel vulnerable or hurt. I'm wondering what might be underneath these angry feelings - what do you think your anger might be trying to tell you?",
      "It sounds like you're feeling really frustrated and angry about your situation. Those are completely understandable feelings given what you're going through. When you feel this anger building up, how do you usually handle it? Have you found any ways to express or release these feelings that feel healthy for you?",
    ]
    return angerResponses[Math.floor(Math.random() * angerResponses.length)]
  }

  if (hasPositive) {
    const positiveResponses = [
      "It's so good to hear some positivity in your voice! I'm really glad you're experiencing these good feelings. It's important to acknowledge and celebrate these moments, even the small ones. What do you think has been helping you feel this way?",
      "I love hearing that you're feeling better! These positive shifts can be so meaningful, especially when we've been going through difficult times. It shows your resilience and strength. What's been different or helpful in your life recently?",
      "That's wonderful to hear! It sounds like something has shifted in a positive direction for you. These good feelings are just as important to talk about as the difficult ones. What would you like to focus on today - maybe exploring what's been working well for you?",
    ]
    return positiveResponses[Math.floor(Math.random() * positiveResponses.length)]
  }

  // Work/career related responses
  if (userInput.includes("work") || userInput.includes("job") || userInput.includes("career")) {
    return "Work stress can really impact our overall wellbeing, can't it? It sounds like your job situation is weighing on you. Whether it's workload, relationships with colleagues, or feeling unfulfilled, work challenges can affect so many areas of our lives. What aspect of work has been most difficult for you lately?"
  }

  // Relationship related responses
  if (userInput.includes("relationship") || userInput.includes("partner") || userInput.includes("family")) {
    return "Relationships can be one of the most rewarding and challenging parts of our lives. It sounds like you're navigating some difficulties in this area. Relationship struggles can feel so personal and emotionally draining. What's been the most challenging part of this relationship situation for you?"
  }

  // Sleep related responses
  if (userInput.includes("sleep") || userInput.includes("tired") || userInput.includes("exhausted")) {
    return "Sleep issues can affect everything - our mood, energy, ability to cope with stress, and overall mental health. It sounds like you're struggling with feeling rested. When our sleep is disrupted, it can make everything else feel so much harder. How long have you been experiencing these sleep difficulties?"
  }

  // General supportive responses
  const generalResponses = [
    "I hear you, and I want you to acknowledge how much strength it takes to share what you're going through. Your feelings and experiences are completely valid. What feels most important for you to talk about right now?",
    "Thank you for continuing to open up with me. It sounds like you're dealing with quite a bit, and I want you to know that you don't have to carry all of this alone. What kind of support feels most helpful to you in moments like this?",
    "I can sense that you're working through some complex feelings and situations. That takes real courage. Sometimes just putting our thoughts and feelings into words can help us process them differently. What's been on your mind the most lately?",
    "It sounds like you're in a difficult space right now, and I want you to know that your feelings make complete sense given what you're experiencing. You're showing real resilience by reaching out and talking about this. What would feel most supportive for you today?",
    "I appreciate you sharing more of what's going on for you. It's clear that you're dealing with some real challenges, and I want you to know that your feelings are completely understandable. What do you think would be most helpful to focus on in our conversation today?",
  ]

  return generalResponses[Math.floor(Math.random() * generalResponses.length)]
}
