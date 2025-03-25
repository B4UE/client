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
const API_LIVE_URL = "http://localhost:5002"

// Update the defineObjective function to use the live API when needed
export async function defineObjective(
  data: DefineObjectiveRequest,
  useLiveApi = false,
): Promise<DefineObjectiveResponse> {
  if (useLiveApi) {
    const response = await fetch(`${API_LIVE_URL}/api/orchestrate`, {
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
  const response = await fetch(`${API_BASE_URL}/api/define-objective`, {
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
    // Convert base64 string to binary data
    const imageData = atob(data.imageFile.split(',')[1])
    const arrayBuffer = new ArrayBuffer(imageData.length)
    const uint8Array = new Uint8Array(arrayBuffer)
    
    for (let i = 0; i < imageData.length; i++) {
      uint8Array[i] = imageData.charCodeAt(i)
    }
    
    const blob = new Blob([uint8Array], { type: 'image/jpeg' })
    
    // Create FormData and append the image
    const formData = new FormData()
    formData.append('image', blob)
    
    // First, send the image to the image-scan endpoint using FormData
    const imageResponse = await fetch(`${API_LIVE_URL}/api/image-scan`, {
      method: "POST",
      body: formData,
    })

    if (!imageResponse.ok) {
      throw new Error("Failed to scan image")
    }

    const imageResult = await imageResponse.json()
    const imageAnalysis = imageResult.analysis || "Unknown food item"
    
    // Then, use the orchestrate endpoint with the image description to determine if food is allowed
    const response = await fetch(`${API_LIVE_URL}/api/orchestrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation: [{ 
          role: "user", 
          content: `I want to check if I can eat this food item: ${imageAnalysis}` 
        }],
        userProfile: {},
        agentType: "scanFood",
        objectives: data.objectives,
        imageDescription: imageAnalysis
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
  const response = await fetch(`${API_BASE_URL}/api/scan-food`, {
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
    const response = await fetch(`${API_LIVE_URL}/api/orchestrate`, {
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

