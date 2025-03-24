import { type NextRequest, NextResponse } from "next/server"

// This is a mock implementation of the Flask backend API
// In a real application, these requests would be forwarded to the Flask server

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const body = await request.json()

  // Add a small delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000))

  switch (path) {
    case "define-objective":
      return handleDefineObjective(body)
    case "scan-food":
      return handleScanFood(body)
    case "chat":
      return handleChat(body)
    default:
      return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
  }
}

async function handleDefineObjective(body: any) {
  const { objective, metrics } = body

  // Mock refinement logic
  const refinedObjective = objective.charAt(0).toUpperCase() + objective.slice(1)

  // Keep the same metrics but ensure they have proper structure
  const refinedMetrics = Object.entries(metrics).reduce(
    (acc, [key, value]) => {
      acc[key] = {
        value: (value as any).value || value,
        unit: (value as any).unit || "",
      }
      return acc
    },
    {} as Record<string, any>,
  )

  return NextResponse.json({
    status: "success",
    refinedObjective,
    refinedMetrics,
  })
}

async function handleScanFood(body: any) {
  const { imageFile, objectives } = body

  // Mock food analysis logic
  // In a real app, this would use image recognition and LLM analysis
  const randomOutcome = Math.random() > 0.5

  return NextResponse.json({
    status: "success",
    isAllowed: randomOutcome,
    reason: randomOutcome
      ? "This food item aligns with your health objectives. It contains nutrients that support your goals."
      : "This food item contains ingredients that may interfere with your health objectives.",
  })
}

async function handleChat(body: any) {
  const { userMessage, context } = body

  // Mock chat response logic
  // In a real app, this would use an LLM to generate responses
  let response = ""

  if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
    response = "Hello! How can I help you with your health objectives today?"
  } else if (userMessage.toLowerCase().includes("objective")) {
    response =
      'Your objectives help me provide personalized guidance. You can add or modify them using the "Add Objective" button.'
  } else if (userMessage.toLowerCase().includes("food") || userMessage.toLowerCase().includes("eat")) {
    response = "You can upload a photo of any food item, and I'll analyze it based on your health objectives."
  } else if (userMessage.toLowerCase().includes("how")) {
    response =
      "I work by analyzing your health objectives and providing personalized guidance. The more information you share, the better I can assist you."
  } else {
    response =
      "I understand you're asking about your health. Could you provide more details or upload a food image for me to analyze?"
  }

  return NextResponse.json({
    status: "success",
    botResponse: response,
  })
}

