import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "lucide-react";
import RoundedInput from "./MessageInputComp";
import { clearAIError, addOptimisticMessage } from "../../slices/aiChatSlice";
import { sendMessageToAI, getConversationThunk } from "../../thunks/aiChatThunk";
import { deleteMessageThunk } from "../../thunks/messageThunks";
import IYTElogo from "../../assets/iyte_logo_eng.png";
import ErrorMessage from "../ui/error_message";
import CustomDropdown from "../ui/custom_dropdown";

const AIComponent = ({ apiUrl }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const { messages, loading: aiLoading, error: aiError, historyLoading, messageStatus } = useSelector(
    (state) => state.aiMessaging
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getConversationThunk(apiUrl));
  }, [dispatch, apiUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, historyLoading]);

  useEffect(() => {
    if (aiError) {
      const timer = setTimeout(() => dispatch(clearAIError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [aiError, dispatch]);

  const handleSend = (message) => {
    if (!message.trim()) return;
    
    // Create a temporary ID for optimistic UI update
    const tempMessageId = `temp-${Date.now()}`;
    
    // Add optimistic message to UI immediately
    dispatch(addOptimisticMessage({
      id: tempMessageId,
      message: message,
      isSentByUser: true,
      isOptimistic: true,
      timestamp: new Date().toISOString(),
    }));
    
    // Send actual message to API with the temporary ID
    dispatch(sendMessageToAI({ 
      message, 
      apiUrl, 
      tempMessageId 
    }));
    
    // Scroll to bottom after sending
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await dispatch(deleteMessageThunk({ apiUrl, messageId })).unwrap();
      dispatch(getConversationThunk(apiUrl));
    } catch (error) {
      console.error("Message deletion failed:", error);
      alert(t("delete_message_error"));
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return timeA - timeB;
  });

  return (
    <div className={`flex flex-col w-full bg-background ${isMobile ? "h-screen" : "h-full max-h-[90%]"} `}>
      <div className={`flex-1 overflow-y-auto flex flex-col ${isMobile ? "pb-36" : "pb-0"} p-2 md:p-4 space-y-4 relative`}>
        {historyLoading && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#8B0000] rounded-full animate-spin"></div>
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="flex-1 flex justify-center items-center text-center px-4">
            <div className="text-muted-foreground">{t("start_conversation")}</div>
          </div>
        ) : (
          sortedMessages.map((msg) => {
            // Check message status
            const isLoading = msg.isOptimistic;
            const hasError = messageStatus && messageStatus[msg.id]?.error;
            
            return (
              <div
                key={msg.id}
                className={`flex items-center gap-0 group ${msg.isSentByUser ? "justify-end" : "justify-start"}`}
              >
                {msg.isSentByUser ? (
                  <div className="flex items-center gap-0 relative hover:dropup-container">
                    <CustomDropdown 
                      onDelete={() => handleDeleteMessage(msg.id)} 
                      isSentByUser={true} 
                      disabled={isLoading}
                    />
                    <div 
                      className={`p-3 rounded-lg break-words text-sm md:text-base ${
                        hasError ? "bg-red-200 text-red-900" : "bg-red-800 text-white"
                      } rounded-br-none max-w-[90%] xs:max-w-[80%] relative ${
                        isLoading ? "opacity-70" : ""
                      }`}
                    >
                      {msg.message}
                      <div className="mt-1 text-xs text-right flex justify-end items-center">
                        {/* Loading indicator */}
                        {isLoading && (
                          <Loader size={12} className="mr-1 animate-spin" />
                        )}
                        {/* Error indicator */}
                        {hasError && (
                          <span className="text-red-600 mr-1 text-xs">!</span>
                        )}
                        {new Date(msg.timestamp).toLocaleString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-0 relative hover:dropup-container">
                    <img src={IYTElogo} alt="IYTE Logo" className="w-9 h-9 object-contain hidden sm:block mr-2" />
                    <div className="p-3 rounded-lg break-words text-sm md:text-base bg-gray-200 text-foreground rounded-bl-none max-w-[90%] xs:max-w-[80%]">
                      {msg.message}
                      <div className="mt-1 text-xs text-right flex justify-end items-center">
                        {new Date(msg.timestamp).toLocaleString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                    <CustomDropdown 
                      onDelete={() => handleDeleteMessage(msg.id)} 
                      isSentByUser={false}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {aiError && (
        <div className="px-4">
          <ErrorMessage message={aiError} />
        </div>
      )}

      <div className={`sticky bottom-0 border-t p-2 bg-white ${isMobile ? "mt-10" : "mt-5"}`}>
        <div className="max-w-3xl mx-auto w-full">
          <RoundedInput onSend={handleSend} fullWidth disabled={aiLoading} />
        </div>
      </div>
    </div>
  );
};

export default AIComponent;