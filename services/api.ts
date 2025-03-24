export interface DefineObjectiveRequest {
  objective: string
  metrics: Record<string, any>
}

export interface DefineObjectiveResponse {
  status: string
  refinedObjective: string
  refinedMetrics: Record<string, any>
}

export interface ScanFoodRequest {
  imageFile: string // base64 encoded image
  objectives: string
}

export interface ScanFoodResponse {
  status: string
  isAllowed: boolean
  reason: string
}

export interface ChatRequest {
  userMessage: string
  context: Record<string, any>
}

export interface ChatResponse {
  status: string
  botResponse: string
}

// Update the API_LIVE_URL to point to localhost:5000
const API_BASE_URL = "/api"
const API_LIVE_URL = "https://localhost:5000/"

// Update the defineObjective function to use the live API when needed
export async function defineObjective(
  data: DefineObjectiveRequest,
  useLiveApi = false,
): Promise<DefineObjectiveResponse> {
  if (useLiveApi) {
    const response = await fetch(`${API_LIVE_URL}/orchestrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation: [{ role: "user", content: `I want to set a new objective: ${data.objective}` }],
        userProfile: {},
        agentType: "defineObjective",
        objective: data.objective,
        metrics: data.metrics,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to define objective")
    }

    const result = await response.json()
    return {
      status: "success",
      refinedObjective: result.objective || data.objective,
      refinedMetrics: result.updatedUserProfile?.metrics || data.metrics,
    }
  }

  // Original mock implementation
  const response = await fetch(`${API_BASE_URL}/define-objective`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to define objective")
  }

  return response.json()
}

// Update the scanFood function to use the live API when needed
export async function scanFood(data: ScanFoodRequest, useLiveApi = false): Promise<ScanFoodResponse> {
  if (useLiveApi) {
    const response = await fetch(`${API_LIVE_URL}/orchestrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation: [{ role: "user", content: "I want to check if I can eat this food item." }],
        userProfile: {},
        agentType: "scanFood",
        imageFile: data.imageFile,
        objectives: data.objectives,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to scan food")
    }

    const result = await response.json()
    return {
      status: "success",
      isAllowed: result.result?.isAllowed || false,
      reason: result.result?.reason || "Could not determine if this food is suitable for your objectives.",
    }
  }

  // Original mock implementation
  const response = await fetch(`${API_BASE_URL}/scan-food`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to scan food")
  }

  return response.json()
}

// Update the sendChatMessage function to use the live API when needed
export async function sendChatMessage(data: ChatRequest, useLiveApi = false): Promise<ChatResponse> {
  if (useLiveApi) {
    const response = await fetch(`${API_LIVE_URL}/orchestrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation: [{ role: "user", content: data.userMessage }],
        userProfile: {},
        context: data.context,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send chat message")
    }

    const result = await response.json()
    return {
      status: "success",
      botResponse: result.updatedConversation?.[1]?.content || "I couldn't process your request.",
    }
  }

  // Original mock implementation
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to send chat message")
  }

  return response.json()
}

