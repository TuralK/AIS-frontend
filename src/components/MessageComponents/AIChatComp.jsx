import React, { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import RoundedInput from "./MessageInputComp"
import IYTElogo from "../../assets/iyte_logo_eng.png"

const AIComponent = ({ onBack, api }) => {
  const [inputMessage, setInputMessage] = useState("")
  const [messages, setMessages] = useState([])
  const { t } = useTranslation()
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message) => {
    if (!message.trim()) return

    setMessages((prev) => [...prev, { message: message, fromUser: true }])

    try {
      const response = await api(message)
      setMessages((prev) => [...prev, { message: response.aiMessage, fromUser: false }])
    } catch (error) {
      console.error("Error getting AI response:", error)
      setMessages((prev) => [
        ...prev,
        { message: "Sorry, there was an error processing your request.", fromUser: false },
      ])
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages container */}
      <div 
        ref={containerRef} 
        className="flex-grow overflow-y-auto p-2 md:p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="h-full flex justify-center items-center text-center px-4">
            <div className="text-muted-foreground">
              {t("start_conversation")}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.fromUser ? "justify-end" : "justify-start"} items-end gap-2`}
            >
              {!msg.fromUser && (
                <img 
                  src={IYTElogo || "/placeholder.svg"} 
                  alt="IYTE Logo" 
                  className="w-8 h-8 object-contain hidden xs:block" 
                />
              )}
              <div
                className={`
                  max-w-[90%] xs:max-w-[80%] p-3 rounded-lg break-words
                  ${msg.fromUser
                    ? "bg-red-800 text-white ml-auto rounded-br-none"
                    : "bg-gray-200 text-foreground mr-auto rounded-bl-none"
                  }
                  text-sm md:text-base
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
      <div className="w-full px-2 md:px-4 py-2 border-t">
        <div className="max-w-3xl mx-auto w-full">
          <RoundedInput onSend={handleSend} fullWidth />
        </div>
      </div>
    </div>
  )
}

export default AIComponent