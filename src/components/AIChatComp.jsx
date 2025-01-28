import React, { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { useTranslation } from "react-i18next"
import RoundedInput from "./MessageInputComp"
import IYTElogo from "../assets/iyte_logo_eng.png"

const AIComponent = ({ onBack, api }) => {
  const [inputMessage, setInputMessage] = useState("")
  // Fixed the type error by properly initializing the messages state
  const [messages, setMessages] = useState([])
  const { t } = useTranslation()
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom]) // Added scrollToBottom to dependencies

  const handleSend = async (message) => {
    if (!message.trim()) return // Prevent empty messages

    // Add user message
    setMessages((prev) => [...prev, { message: message, fromUser: true }])

    try {
      const response = await api(message)
      // Add AI response
      setMessages((prev) => [...prev, { message: response.aiMessage, fromUser: false }])
    } catch (error) {
      console.error("Error getting AI response:", error)
      // Optionally show error message to user
      setMessages((prev) => [
        ...prev,
        { message: "Sorry, there was an error processing your request.", fromUser: false },
      ])
    }
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto bg-background">
      {/* Messages container */}
      <div ref={containerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-muted-foreground">{t("start_conversation")}</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.fromUser ? "justify-end" : "justify-start"} items-end`}>
              {!msg.fromUser && <img src={IYTElogo || "/placeholder.svg"} alt="IYTE Logo" className="w-12 h-12 object-contain" />}
              <div
                className={`
                  max-w-[80%] p-3 rounded-lg break-words
                  ${
                    msg.fromUser
                      ? "bg-red-800 text-white ml-auto rounded-br-none"
                      : "bg-gray-200 text-foreground mr-auto rounded-bl-none"
                  }
                `}
              >
                {msg.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-1 border-t">
        <RoundedInput onSend={handleSend} />
      </div>
    </div>
  )
}

export default AIComponent