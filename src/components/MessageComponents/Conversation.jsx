import { useState, useEffect, useRef } from "react"
import { ArrowLeft, MoreVertical, Trash2, Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import RoundedInput from "./MessageInputComp"
import { sendMessage, deleteMessage } from "../../api/messageApi"
import { scrollToBottom, markMessagesAsRead } from "../../utils/conversationUtils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown"
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"
import ErrorMessage from "../ui/error_message"  

const Conversation = ({ conversation: initialConversation, onBack, apiUrl }) => {
  const { t } = useTranslation()
  const [conversation, setConversation] = useState(initialConversation)
  const [errorSendingMessage, setErrorSendingMessage] = useState(false) // Track if there was an error
  const messagesEndRef = useRef(null)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState([])

  // Scroll ve okundu işaretleme
  useEffect(() => {
    scrollToBottom(messagesEndRef)
    markMessagesAsRead(conversation, apiUrl)
  }, [conversation])

  // Mesaj gönderme
  const handleSend = async (newMessage) => {
    if (!newMessage.trim()) return

    const tempMessage = {
      type: "sent",
      message: newMessage,
      id: `temp-${Date.now()}`, 
      isTemp: true
    }

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, tempMessage]
    }))

    try {
      const topic = conversation.messages[0]?.topic || ""
      const receiverEmail = conversation.from

      const sentMessage = await sendMessage(
        `${apiUrl}/sendMessage`,
        newMessage,
        topic,
        receiverEmail
      )
      
      setConversation(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === tempMessage.id ? { ...sentMessage, type: "sent" } : msg
        )
      }))
      console.log("Mesajlar:", conversation.messages)
      setErrorSendingMessage(false) 

    } catch (error) {
      
      setConversation(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== tempMessage.id)
      }))
      setErrorSendingMessage(true) 

      
      setTimeout(() => setErrorSendingMessage(false), 4000)
    }
  }

  
  const handleDeleteMessage = async (messageId) => {
    try {
      
      await deleteMessage(apiUrl, messageId)
      
      setConversation(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== messageId)
      }))
    } catch (error) {
      console.error("Silme hatası:", error)
    }
  }

  
  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedMessages.map((id) => deleteMessage(apiUrl, id)))
      setConversation((prev) => ({
        ...prev,
        messages: prev.messages.filter((msg) => !selectedMessages.includes(msg.id)),
      }))
      setSelectedMessages([])
      setIsSelectionMode(false)
    } catch (error) {
      console.error("Toplu silme işlemi başarısız:", error)
    }
  }

  // Mesaj seçimini yönet
  const toggleMessageSelection = (messageId) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId) 
        : [...prev, messageId]
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b-2 border-gray-300 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-gray-800 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <span className="font-semibold">{conversation.senderName}</span>
        </div>
        
        {/* Silme kontrolleri */}
        <div className="flex items-center gap-2">
          {isSelectionMode && selectedMessages.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleBulkDelete}
              className="flex items-center gap-1"
            >
              <Trash2 size={16} />
              <span>{selectedMessages.length} {t("delete_selected")}</span>
            </Button>
          )}
          
          <button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode)
              setSelectedMessages([]) 
            }}
            className={`p-2 rounded-full transition-colors ${isSelectionMode ? "bg-red-100 text-red-600" : "text-gray-600 hover:bg-gray-100"}`}
          >
            {isSelectionMode ? <Check size={20} /> : <Trash2 size={20} />}
          </button>
        </div>
      </div>

      {/* Mesaj listesi */}
      <div className="flex-grow overflow-y-auto p-4">
        <div className="flex flex-col space-y-2">
          {conversation.messages.length > 0 ? (
            conversation.messages.map((msg) => (
              <div key={msg.id} className="w-full flex group items-center gap-2">
                {/* Seçim/İşlem alanı */}
                {msg.type === "sent" && (
                  <>
                    {isSelectionMode ? (
                      <Checkbox
                        checked={selectedMessages.includes(msg.id)}
                        onCheckedChange={() => toggleMessageSelection(msg.id)}
                        className="ml-2"
                      />
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                              <MoreVertical size={16} className="text-gray-600" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-24">
                            <DropdownMenuItem
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>{t("delete")}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </>
                )}

                {/* Mesaj balonu */}
                <div
                  className={`inline-block rounded-lg ${
                    msg.type === "sent" 
                      ? "bg-[rgb(154,18,32)] text-white ml-auto" 
                      : "bg-gray-300 text-black mr-auto"
                  } ${msg.isTemp ? "opacity-50" : ""}`} 
                >
                  <p className={`px-3 py-2 ${msg.type === "sent" ? "text-right" : ""}`}>
                    {msg.message}
                    {msg.isTemp && <span className="text-xs ml-2">⌛</span>}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">{t("no_messages_in_conversation")}</p>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Error Message */}
      {errorSendingMessage && (
            <div className="mt-2 p-2">
              <ErrorMessage message="Mesaj gönderilemedi" />
            </div>
          )}
      {/* Mesaj giriş alanı */}
      <div className="p-2">
        <RoundedInput onSend={handleSend} />
      </div>
    </div>
  )
}

export default Conversation
