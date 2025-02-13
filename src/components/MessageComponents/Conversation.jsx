import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ArrowLeft, MoreVertical, Trash2, X, Paperclip } from "lucide-react"
import { useTranslation } from "react-i18next"
import RoundedInput from "./MessageInputComp"
import {
  sendMessageThunk,
  fetchConversationMessagesThunk,
  deleteConversationThunk,
  deleteMessageThunk,
} from "../../thunks/messageThunks"
import { scrollToBottom } from "../../utils/conversationUtils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown"
import { Checkbox } from "../ui/checkbox"
import ErrorMessage from "../ui/error_message"
import { selectConversationMessages } from "../../selectors/conversation_selector"

const Conversation = ({ conversation: initialConversation, onBack, apiUrl }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const conversationId = initialConversation.id

  const messages = useSelector((state) =>
    selectConversationMessages(state, conversationId)
  )
  const loading = useSelector((state) => state.messaging.loading)
  const conversation = useSelector((state) =>
    state.messaging.conversations.find((conv) => conv.id === conversationId)
  )

  const otherPersonName = conversation.user2_name
  const senderName = conversation.user1_email

  const [errorSendingMessage, setErrorSendingMessage] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState([])
  const [isDeletingConversation, setIsDeletingConversation] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [attachedFile, setAttachedFile] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    dispatch(fetchConversationMessagesThunk({ apiUrl, conversationId }))
  }, [dispatch, apiUrl, conversationId])

  useEffect(() => {
    scrollToBottom(messagesEndRef)
  }, [messages])

  const handleSend = async (newMessage) => {
    // Eğer hem mesaj hem de dosya yoksa gönderme yapma.
    if (!newMessage.trim() && !attachedFile) return;
  
    // Eğer mesaj metni boşsa ama dosya varsa, mesajı boş string olarak gönderelim.
    const messageToSend = newMessage.trim() ? newMessage : "";
  
    try {
      await dispatch(
        sendMessageThunk({
          apiUrl,
          conversationId,
          message: messageToSend,
          file: attachedFile,
        })
      ).unwrap();
  
      setErrorSendingMessage(false);
      setAttachedFile(null);
      dispatch(fetchConversationMessagesThunk({ apiUrl, conversationId }));
    } catch (error) {
      setErrorSendingMessage(true);
      setTimeout(() => setErrorSendingMessage(false), 4000);
    }
  };    

  const handleDeleteConversation = async () => {
    setIsDeletingConversation(true)
    try {
      await dispatch(deleteConversationThunk({ apiUrl, conversationId })).unwrap()
      onBack()
    } catch (error) {
      console.error("Conversation deletion failed:", error)
      setShowDeleteConfirmation(false)
      alert(t("delete_conversation_error"))
    } finally {
      setIsDeletingConversation(false)
    }
  }

  const toggleMessageSelection = (messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    )
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await dispatch(deleteMessageThunk({ apiUrl, messageId })).unwrap()
      dispatch(fetchConversationMessagesThunk({ apiUrl, conversationId }))
    } catch (error) {
      console.error("Message deletion failed:", error)
      alert(t("delete_message_error"))
    }
  }

 
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (allowedTypes.includes(file.type)) {
        setAttachedFile(file)
      } else {
        alert(t("invalid_file_type"))
      }
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[90%] w-full border bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-gray-800 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <span className="font-semibold">{otherPersonName}</span>
        </div>
        <div className="flex items-center gap-2">
          {showDeleteConfirmation ? (
            <>
              <button
                onClick={handleDeleteConversation}
                disabled={isDeletingConversation}
                className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">{t("confirm_delete")}</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-[#8B0000] border-gray-200 rounded-full animate-spin"></div>
          </div>
        ) : messages.length > 0 ? (
          <div className="p-4 space-y-2">
            {messages.map((msg) => {
              const isSender = msg.from === senderName

              return (
                <div
                  key={msg.id}
                  className={`w-full flex ${
                    isSender ? "justify-end" : "justify-start"
                  } group items-center gap-2`}
                >
                  {isSender && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {isSelectionMode ? (
                        <Checkbox
                          checked={selectedMessages.includes(msg.id)}
                          onCheckedChange={() => toggleMessageSelection(msg.id)}
                          className="mr-2"
                        />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                              <MoreVertical size={16} className="text-gray-600" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-24">
                            <DropdownMenuItem
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>{t("delete")}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      isSender
                        ? "bg-[rgb(154,18,32)] text-white"
                        : "bg-gray-300 text-black"
                    } ${msg.isTemp ? "opacity-50" : ""}`}
                  >
                    <p className={`${isSender ? "text-right" : "text-left"}`}>
                      {msg.message}
                      {msg.isTemp && <span className="text-xs ml-2">⌛</span>}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            {t("start_conversation")}
          </div>
        )}
      </div>

      {/* Error message */}
      {errorSendingMessage && (
        <div className="p-2">
          <ErrorMessage message="Mesaj gönderilemedi" />
        </div>
      )}

      {/* Bottom part: File attachment + Input */}
      <div className="border-t p-2 bg-white">
        {/* Eklenen dosya varsa dosya adını göster */}
        {attachedFile && (
          <div className="mb-2 flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="text-sm text-gray-800 truncate">{attachedFile.name}</span>
            <button onClick={() => setAttachedFile(null)} className="text-gray-600 hover:text-gray-800">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="flex items-center">
          <RoundedInput onSend={handleSend} attachedFile={attachedFile} />
          {/* Ataç butonu */}
          <label htmlFor="fileInput" className="mr-2 ml-2 cursor-pointer">
            <Paperclip size={20} className="text-gray-600 hover:text-gray-800" />
          </label>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  )
}

export default Conversation