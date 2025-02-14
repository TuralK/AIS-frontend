import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import RoundedInput from "./MessageInputComp";
import { clearAIError } from "../../slices/aiChatSlice";
import { sendMessageToAI, getMessages } from "../../thunks/aiChatThunk";
import IYTElogo from "../../assets/iyte_logo_eng.png";
import ErrorMessage from "../ui/error_message"

const AIComponent = ({ apiUrl }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const messagesEndRef = useRef(null)

  // Redux state'leri
  const {
    messages,
    loading: aiLoading,
    error: aiError,
    historyLoading
  } = useSelector((state) => state.aiMessaging)


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }


  useEffect(() => {
    dispatch(getMessages(apiUrl))
  }, [dispatch, apiUrl])

  useEffect(() => {
    scrollToBottom()
  }, [messages, historyLoading])


  useEffect(() => {
    if (aiError) {
      const timer = setTimeout(() => dispatch(clearAIError()), 5000)
      return () => clearTimeout(timer)
    }
  }, [aiError, dispatch])


  const handleSend = (message) => {
    if (!message.trim()) return
    dispatch(sendMessageToAI({ message, apiUrl }))
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-grow overflow-y-auto p-2 md:p-4 space-y-4 relative">
        {historyLoading ? (
          <div className="h-full flex items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#8B0000] rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
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
                  src={IYTElogo}
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
                {aiLoading && index === messages.length - 1 && (
                  <div className="h-full flex items-center justify-center min-h-[200px]">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-[#8B0000] rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {aiError && (
        <div className="px-4">
          <ErrorMessage message={aiError} />
        </div>
      )}

      <div className="w-full px-2 md:px-4 py-2 border-t">
        <div className="max-w-3xl mx-auto w-full">
          <RoundedInput
            onSend={handleSend}
            fullWidth
            disabled={aiLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default AIComponent