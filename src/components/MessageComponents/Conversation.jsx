import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ArrowLeft, MoreVertical, Trash2, X, Paperclip, Download } from "lucide-react"
import { useTranslation } from "react-i18next"
import RoundedInput from "./MessageInputComp"
import {
  sendMessageThunk,
  fetchConversationMessagesThunk,
  deleteConversationThunk,
  deleteMessageThunk,
} from "../../thunks/messageThunks"
import { scrollToBottom } from "../../utils/conversationUtils"
import CustomDropdown from "../ui/custom_dropdown";
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

  const [errorSendingMessage, setErrorSendingMessage] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState([])
  const [isDeletingConversation, setIsDeletingConversation] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [attachedFile, setAttachedFile] = useState(null)
  const messagesEndRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    dispatch(fetchConversationMessagesThunk({ apiUrl, conversationId }))
  }, [dispatch, apiUrl, conversationId])

  useEffect(() => {
    scrollToBottom(messagesEndRef)
  }, [messages])

  const handleSend = async (newMessage) => {
    if (!newMessage.trim() && !attachedFile) return
    const messageToSend = newMessage.trim() ? newMessage : ""

    try {
      await dispatch(
        sendMessageThunk({
          apiUrl,
          conversationId,
          message: messageToSend,
          file: attachedFile,
        })
      ).unwrap()

      setErrorSendingMessage(false)
      setAttachedFile(null)
      dispatch(fetchConversationMessagesThunk({ apiUrl, conversationId }))
    } catch (error) {
      setErrorSendingMessage(true)
      setTimeout(() => setErrorSendingMessage(false), 4000)
    }
  }

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

  const downloadFile = (fileName, data) => {
    const byteCharacters = atob(data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: "application/octet-stream" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
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
    // Mobilde tam ekran, genişte eski stil
    <div
      className={`flex flex-col w-full border bg-white ${isMobile ? "h-screen" : "h-full max-h-[90%]"
        }`}
    >
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
      <div className={`flex-1 overflow-y-auto flex flex-col ${isMobile ? "pb-36" : "pb-0"}`}>
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-[#8B0000] border-gray-200 rounded-full animate-spin"></div>
          </div>
        ) : messages.length > 0 ? (
          <div className={`p-4  space-y-2`}>
            {messages.map((msg) => {
              const isSender = msg.isSentByUser

              return (
                <div
                  key={msg.id}
                  className={`w-full flex ${isSender ? "justify-end" : "justify-start"
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
                        <CustomDropdown
                          onDelete={() => handleDeleteMessage(msg.id)}
                          isSentByUser={true}
                        />
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${isSender ? "bg-[rgb(154,18,32)] text-white" : "bg-gray-300 text-black"
                      } ${msg.isTemp ? "opacity-50" : ""}`}
                  >
                    {msg.fileName && (
                      <div
                        className={`p-2 mb-2 rounded-md flex items-center gap-2 ${isSender ? "bg-red-100" : "bg-gray-400"
                          }`}
                      >
                        <Download
                          size={16}
                          className={`flex-shrink-0 ${isSender ? "text-red-700" : "text-gray-600"
                            }`}
                        />
                        <button
                          onClick={() => downloadFile(msg.fileName, msg.data)}
                          className={`text-sm truncate max-w-[180px] ${isSender ? "text-red-900" : "text-gray-700"
                            } hover:underline`}
                          title={msg.fileName}
                        >
                          {msg.fileName}
                        </button>
                      </div>
                    )}

                    {msg.message && (
                      <p className={`${isSender ? "text-right" : "text-left"}`}>
                        {msg.message}
                        {msg.isTemp && <span className="text-xs ml-2">⌛</span>}
                      </p>
                    )}

                    {/* Timestamp alanı */}
                    <div className={`mt-1 text-xs text-right ${isSender ? "text-white" : "text-black"}`}>
                      {new Date(msg.timestamp).toLocaleString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
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

      <div className="sticky bottom-0 border-t p-2 bg-white">
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