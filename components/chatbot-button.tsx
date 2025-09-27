"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your SarkariResult assistant. How can I help you today?", isBot: true },
  ])
  const [input, setInput] = useState("")

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSend = () => {
    if (input.trim()) {
      // Add user message
      setMessages([...messages, { text: input, isBot: false }])

      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Thank you for your question. I'll help you find the latest job notifications and exam updates based on your query.",
            isBot: true,
          },
        ])
      }, 1000)

      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-50 rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 right-6 z-50 w-80 rounded-lg border bg-card shadow-xl"
          >
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-semibold">SarkariResult Assistant</h3>
              <Button variant="ghost" size="icon" onClick={toggleChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-80 overflow-y-auto p-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 max-w-[80%] rounded-lg p-3 ${
                    msg.isBot ? "bg-muted text-foreground" : "ml-auto bg-blue-600 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="border-t p-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
