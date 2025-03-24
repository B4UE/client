"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "../../contexts/chat-context"
import { useObjectives } from "../../contexts/objectives-context"
import { useScannedItems } from "../../contexts/scanned-items-context"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  SendIcon,
  CameraIcon,
  RefreshCwIcon,
  BugIcon,
  Apple,
  Pizza,
  Sandwich,
  Coffee,
  IceCream,
  Carrot,
  Beef,
  Egg,
  Fish,
  Banana,
  Cherry,
  CloudIcon,
} from "lucide-react"
import ChatMessage from "./chat-message"
import TypingIndicator from "./typing-indicator"
import ImageUploader from "./image-uploader"
import { sendChatMessage, scanFood } from "../../services/api"
import ResultAnimation from "../feedback/result-animation"
import { useApiMode } from "../../contexts/api-mode-context"
import ToggleSwitch from "../ui/toggle-switch"

// Array of food icons to randomly select from
const foodIcons = [Apple, Pizza, Sandwich, Coffee, IceCream, Carrot, Beef, Egg, Fish, Banana, Cherry]

export default function ChatBox() {
  const { messages, addMessage, clearMessages, isLoading, setIsLoading } = useChat()
  const { objectives, addObjective, deleteObjective } = useObjectives()
  const { addScannedItem, clearScannedItems } = useScannedItems()
  const { isLive, toggleApiMode } = useApiMode()
  const [userInput, setUserInput] = useState("")
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false)
  const [showAnimation, setShowAnimation] = useState<"good" | "bad" | null>(null)
  const [showDebugTools, setShowDebugTools] = useState(false)
  const [currentFoodIcon, setCurrentFoodIcon] = useState<React.ElementType>(SendIcon)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      // Start onboarding process
      setTimeout(() => {
        addMessage(
          "assistant",
          "Welcome to B4Ueat! I'm your health assistant. Tell me about your health objectives like 'I want to lose weight' or 'I need to avoid gluten', and I'll help you make better food choices.",
        )
      }, 1000)
      localStorage.setItem("hasVisited", "true")
    }
  }, [addMessage])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Focus input after sending a message
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  const getRandomFoodIcon = () => {
    const randomIndex = Math.floor(Math.random() * foodIcons.length)
    return foodIcons[randomIndex]
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userInput.trim()) return

    // Change the food icon
    setCurrentFoodIcon(getRandomFoodIcon())

    const message = userInput.trim()
    setUserInput("")
    addMessage("user", message)

    // Check for keywords to add objectives
    const lowerMessage = message.toLowerCase()
    if (
      lowerMessage.includes("weight") ||
      lowerMessage.includes("allerg") ||
      lowerMessage.includes("avoid") ||
      lowerMessage.includes("diet") ||
      lowerMessage.includes("health") ||
      lowerMessage.includes("goal")
    ) {
      // Add a new objective based on the message
      const newObjective = {
        description: message,
        metrics: [],
      }

      addObjective(newObjective)

      // Add a confirmation message
      setTimeout(() => {
        addMessage(
          "assistant",
          `I've added "${message}" to your health objectives. I'll keep this in mind when analyzing foods for you.`,
        )
      }, 500)
    }

    setIsLoading(true)

    try {
      // Get objectives as context
      const objectivesContext = objectives.map((obj) => ({
        description: obj.description,
        metrics: obj.metrics,
      }))

      // Send message to API
      const response = await sendChatMessage(
        {
          userMessage: message,
          context: { objectives: objectivesContext },
        },
        isLive,
      )

      addMessage("assistant", response.botResponse)
    } catch (error) {
      console.error("Error sending message:", error)

      // Fallback response if API fails
      addMessage("assistant", "I'm having trouble connecting to the server. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (base64Image: string) => {
    setIsImageUploaderOpen(false)
    // Don't add the message immediately, wait for the result
    setIsLoading(true)

    try {
      // Get objectives as context
      const objectivesString = objectives.map((obj) => obj.description).join("; ")

      // Send image to API
      const response = await scanFood(
        {
          imageFile: base64Image,
          objectives: objectivesString,
        },
        isLive,
      )

      // Add to scanned items history
      addScannedItem({
        name: "Food Item", // Default name
        imageUrl: base64Image,
        outcome: response.isAllowed ? "good" : "bad",
        reason: response.reason,
      })

      // Add user message now that we have the result
      addMessage("user", "I want to check if I can eat this food item.")

      // Show animation with window effects
      setShowAnimation(response.isAllowed ? "good" : "bad")

      // Prepare response message
      const responseMessage = response.isAllowed
        ? `✅ Yes, this food item is suitable for your objectives. ${response.reason}`
        : `❌ This food item is not recommended for your objectives. ${response.reason}`

      // We'll add the message after the animation completes
      setTimeout(() => {
        addMessage("assistant", responseMessage)
        // Ensure animation is cleared after message is added
        setShowAnimation(null)
      }, 2000)
    } catch (error) {
      console.error("Error scanning food:", error)

      // Add user message in case of error
      addMessage("user", "I want to check if I can eat this food item.")

      // Fallback response if API fails
      addMessage("assistant", "I'm having trouble analyzing this image. Please try again later.")

      // Clear animation state in case of error
      setShowAnimation(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset all data
  const handleResetAll = () => {
    clearMessages()
    clearScannedItems()

    // Clear objectives by deleting each one
    objectives.forEach((obj) => {
      deleteObjective(obj.id)
    })

    // Reset localStorage
    localStorage.removeItem("hasVisited")

    // Add welcome message
    setTimeout(() => {
      addMessage(
        "assistant",
        "Welcome to B4Ueat! I'm your health assistant. Tell me about your health objectives like 'I want to lose weight' or 'I need to avoid gluten', and I'll help you make better food choices.",
      )
    }, 500)
  }

  // Debug functions
  const triggerGoodAnimation = () => {
    setShowAnimation("good")
    setTimeout(() => {
      addScannedItem({
        name: "Debug Good Item",
        outcome: "good",
        reason: "This is a debug test for the good animation.",
      })
      addMessage("assistant", "✅ Debug: Good food animation triggered.")
      // Ensure animation is cleared after debug message is added
      setShowAnimation(null)
    }, 2000)
  }

  const triggerBadAnimation = () => {
    setShowAnimation("bad")
    setTimeout(() => {
      addScannedItem({
        name: "Debug Bad Item",
        outcome: "bad",
        reason: "This is a debug test for the bad animation.",
      })
      addMessage("assistant", "❌ Debug: Bad food animation triggered.")
      // Ensure animation is cleared after debug message is added
      setShowAnimation(null)
    }, 2000)
  }

  // Dynamically render the current food icon
  const FoodIcon = currentFoodIcon

  return (
    <div className="flex flex-col bg-card rounded-lg border border-border h-full w-full">
      <div className="flex justify-between items-center p-3 border-b border-border">
        <div className="flex items-center flex-wrap gap-2">
          <h2 className="text-base font-semibold mr-2">
            {objectives.length > 0 ? <span>Your Health Goals:</span> : <span>Set Your Health Goals</span>}
          </h2>
          {objectives.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {objectives.map((objective) => (
                <div
                  key={objective.id}
                  className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium"
                  title={objective.description}
                >
                  {objective.description.length > 20
                    ? `${objective.description.substring(0, 20)}...`
                    : objective.description}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-3">
            <div className="flex items-center space-x-2 bg-secondary/50 px-2 py-1 rounded-full">
              <CloudIcon className={`h-4 w-4 ${isLive ? "text-primary" : "text-muted-foreground"}`} />
              <ToggleSwitch checked={isLive} onChange={toggleApiMode} label="Go Live" size="sm" />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDebugTools(!showDebugTools)}
            title="Debug tools"
            className="mr-2 h-8 w-8"
          >
            <BugIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleResetAll} title="Reset all data" className="h-8 w-8">
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showDebugTools && (
        <div className="p-2 bg-muted flex justify-center space-x-2">
          <Button size="sm" variant="outline" onClick={triggerGoodAnimation}>
            Test Good Animation
          </Button>
          <Button size="sm" variant="outline" onClick={triggerBadAnimation}>
            Test Bad Animation
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Button
            type="button"
            variant="default"
            onClick={() => setIsImageUploaderOpen(true)}
            className="shrink-0 bg-primary/90 hover:bg-primary"
          >
            <CameraIcon className="h-5 w-5 mr-2" />
            Scan Food
          </Button>
          <Input
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={!userInput.trim() || isLoading} className="shrink-0">
            <FoodIcon className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>

      <ImageUploader
        isOpen={isImageUploaderOpen}
        onClose={() => setIsImageUploaderOpen(false)}
        onUpload={handleImageUpload}
      />
      {showAnimation && <ResultAnimation result={showAnimation} onComplete={() => setShowAnimation(null)} />}
    </div>
  )
}

