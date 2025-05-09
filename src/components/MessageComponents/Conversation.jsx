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
import { scrollToBottom } from "../../utils/conversationUtils";
import CustomDropdown from "../ui/custom_dropdown";
import ErrorMessage from "../ui/error_message";
import { selectConversationMessages } from "../../selectors/conversation_selector";

const Conversation = ({ conversation: initialConversation, onBack, apiUrl }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const convId = initialConversation.id;
  const messages = useSelector(state => selectConversationMessages(state, convId));
  
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
        dispatch(markReadWS(msg.id));
      }
    });
  }, [messages, dispatch]);

  const handleSend = text => {
    if (!text.trim() && !attachedFile) return;
    dispatch(sendMessageWS(convId, text.trim(), attachedFile, attachedFile?.name));
    setAttachedFile(null);
  };

  const handleDeleteMsg = id => {
    dispatch(deleteMessageWS(id));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) setAttachedFile(file);
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
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <span className="font-semibold">{otherName}</span>
        <button onClick={onBack}><Trash2 size={20} /></button>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto flex flex-col ${isMobile ? "pb-36" : "pb-0"}`}>
        {messages.length > 0 ? (
          <div className="p-4 space-y-2">
            {messages.map(msg => {
              const isSender = msg.isSentByUser;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isSender ? "justify-end" : "justify-start"} items-center gap-2`}
                >
                  {isSender && (
                    <CustomDropdown onDelete={() => handleDeleteMsg(msg.id)} isSentByUser />
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      isSender ? "bg-red-700 text-white" : "bg-gray-300 text-black"
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
              );
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