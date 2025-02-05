import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import RoundedInput from "./MessageInputComp"
import { sendMessage, updateMessageStatus } from "../api/messageApi"

const Conversation = ({ conversation: initialConversation, onBack }) => {
  const { t } = useTranslation()
  const [conversation, setConversation] = useState(initialConversation)

  useEffect(() => {
    console.log("Conversation updated:", conversation)
    const updateMessages = async () => {
      await Promise.all(
        conversation.messages
          .filter((msg) => msg.type === "received" && msg.status !== "read")
          .map((msg) => updateMessageStatus("http://localhost:3003/messages/", msg.id)),
      )
    }

    updateMessages()
  }, [conversation])

  const handleSend = async (newMessage) => {
    if (newMessage.trim()) {
      try {
        const topic = conversation.messages.length > 0 ? conversation.messages[0].topic : ""
        const receiverEmail = conversation.from

        await sendMessage("http://localhost:3003/sendMessage", newMessage, topic, receiverEmail)

        setConversation((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              type: "sent",
              message: newMessage,
            },
          ],
        }))
      } catch (error) {
        console.error("Mesaj gönderilirken hata oluştu:", error)
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b-2 border-gray-300 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-gray-800 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <span className="font-semibold">{conversation.senderName}</span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        <div className="flex flex-col space-y-2">
          {conversation.messages.length > 0 ? (
            conversation.messages.map((msg, index) => (
              <div key={index} className="w-full flex">
                <div
                  className={`inline-block rounded-lg ${
                    msg.type === "sent" ? "bg-[rgb(154,18,32)] text-white ml-auto" : "bg-gray-300 text-black mr-auto"
                  }`}
                >
                  <p className={`px-3 py-2 ${msg.type === "sent" ? "text-right" : ""}`}>{msg.message}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">{t("no_messages_in_conversation")}</p>
          )}
        </div>
      </div>

      <div className="p-2">
        <RoundedInput onSend={handleSend} />
      </div>
    </div>
  )
}

export default Conversation