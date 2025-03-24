"use client"

import { motion } from "framer-motion"

interface ToggleSwitchProps {
  checked: boolean
  onChange: () => void
  label?: string
  size?: "sm" | "md" | "lg"
}

export default function ToggleSwitch({ checked, onChange, label, size = "md" }: ToggleSwitchProps) {
  const sizes = {
    sm: {
      track: "w-8 h-4",
      thumb: "w-3 h-3",
      translateX: 16,
    },
    md: {
      track: "w-10 h-5",
      thumb: "w-4 h-4",
      translateX: 20,
    },
    lg: {
      track: "w-12 h-6",
      thumb: "w-5 h-5",
      translateX: 24,
    },
  }

  return (
    <div className="flex items-center">
      {label && <span className="mr-2 text-xs font-medium">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex ${sizes[size].track} flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          checked ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        <span className="sr-only">{label || "Toggle"}</span>
        <motion.span
          className={`pointer-events-none ${sizes[size].thumb} rounded-full bg-white shadow-lg`}
          animate={{ x: checked ? sizes[size].translateX : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}

