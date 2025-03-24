"use client"

import { motion } from "framer-motion"
import type { Message } from "../../contexts/chat-context"
import { formatTime } from "../../lib/utils"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`max-w-[85%]`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className={`text-xs text-muted-foreground mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  )
}

