"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface ChatContextType {
  messages: Message[]
  addMessage: (role: "user" | "assistant", content: string) => void
  clearMessages: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Hello! I'm your health assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = (role: "user" | "assistant", content: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const clearMessages = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Hello! I'm your health assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ])
  }

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages, isLoading, setIsLoading }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

