import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Trash2, X, Paperclip, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import RoundedInput from "./MessageInputComp";
import {
  connectConversation,
  disconnectConversation,
  sendMessageWS,
  deleteMessageWS,
  markReadWS
} from "../../thunks/messagingActions";
import {
  deleteConversationThunk,
} from "../../thunks/messageThunks";
import { scrollToBottom } from "../../utils/conversationUtils";
import CustomDropdown from "../ui/custom_dropdown";
import ErrorMessage from "../ui/error_message";
import { selectConversationMessages } from "../../selectors/conversation_selector";

const Conversation = ({ conversation: initialConversation, onBack, apiUrl }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const convId = initialConversation.id;
  const messages = useSelector(state => selectConversationMessages(state, convId));
  const loading = useSelector((state) => state.messaging.loading);
  const [errorSendingMessage, setErrorSendingMessage] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]); // Added missing state
  const [isDeletingConversation, setIsDeletingConversation] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const otherName = initialConversation.user2_name;

  const [attachedFile, setAttachedFile] = useState(null);
  const [errorSending, setErrorSending] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const endRef = useRef(null);

  // Responsive flag
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Socket.IO connection & history load
  useEffect(() => {
    dispatch(connectConversation(apiUrl, convId));
    return () => {
      dispatch(disconnectConversation());
    };
  }, [dispatch, apiUrl, convId]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom(endRef);
  }, [messages]);

  // Mark incoming as read
  useEffect(() => {
    messages.forEach(msg => {
      if (!msg.isSentByUser && !msg.is_read) {
        console.log("Marking message as read:", msg.id);
        dispatch(markReadWS(msg.id));
      }
    });
  }, [messages, dispatch]);

  const handleDeleteConversation = async () => {
    let conversationId = initialConversation.id;
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

  const handleSend = text => {
    if (!text.trim() && !attachedFile) return;
    try {
      dispatch(sendMessageWS(convId, text.trim(), attachedFile, attachedFile?.name));
      setErrorSendingMessage(false)
      setAttachedFile(null);
    } catch (error) {
      setErrorSendingMessage(true)
      setTimeout(() => setErrorSendingMessage(false), 4000)
    }

  };

  const handleDeleteMsg = id => {
    try {
      dispatch(deleteMessageWS(id));
    } catch (error) {
      alert(t("delete_message_error"))
    }
  };

  const handleFileChange = e => {
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
  };

  const downloadFile = (name, data) => {
    const bytes = atob(data);
    const arr = Uint8Array.from([...bytes].map(c => c.charCodeAt(0)));
    const blob = new Blob([arr]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex flex-col w-full border bg-white ${isMobile ? "h-screen" : "h-full max-h-[90%]"}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-gray-800 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <span className="font-semibold">{otherName}</span>
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
          <div className="p-4 space-y-2">
            {messages.map(msg => {
              const isSender = msg.isSentByUser;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isSender ? "justify-end" : "justify-start"} items-center gap-2 group`}
                >
                  {isSender && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {isSelectionMode ? (
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(msg.id)}
                          onChange={() => toggleMessageSelection(msg.id)}
                          className="mr-2"
                        />
                      ) : (
                        <CustomDropdown
                          onDelete={() => handleDeleteMsg(msg.id)}
                          isSentByUser={true}
                        />
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${isSender ? "bg-red-700 text-white" : "bg-gray-300 text-black"
                      }`}
                  >
                    {msg.fileName && (
                      <div className="flex items-center gap-2 p-2 mb-2 bg-gray-400 rounded">
                        <Download size={16} />
                        <button onClick={() => downloadFile(msg.fileName, msg.data)} className="truncate">
                          {msg.fileName}
                        </button>
                      </div>
                    )}
                    {msg.message && <p>{msg.message}</p>}
                    <div className="mt-1 text-xs text-right">
                      {new Date(msg.timestamp).toLocaleString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={endRef} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            {t("start_conversation")}
          </div>
        )}
      </div>

      {/* Error message */}
      {errorSending && (
        <div className="p-2">
          <ErrorMessage message={t("message_not_send")} />
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 border-t p-2 bg-white">
        {attachedFile && (
          <div className="mb-2 flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="truncate">{attachedFile.name}</span>
            <button onClick={() => setAttachedFile(null)}><X size={16} /></button>
          </div>
        )}
        <div className="flex items-center">
          <RoundedInput onSend={handleSend} attachedFile={attachedFile} />
          <label htmlFor="fileInput" className="cursor-pointer ml-2">
            <Paperclip size={20} />
          </label>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Conversation;