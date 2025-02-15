import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import RoundedInput from "./MessageInputComp";
import { clearAIError, setConversationId } from "../../slices/aiChatSlice";
import {
  sendMessageToAI,
  getMessages,
  createConversationThunk,
  getConversationThunk,
} from "../../thunks/aiChatThunk";
import IYTElogo from "../../assets/iyte_logo_eng.png";
import ErrorMessage from "../ui/error_message";

const AIComponent = ({ apiUrl }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    messages,
    loading: aiLoading,
    error: aiError,
    historyLoading,
    conversationId,
  } = useSelector((state) => state.aiMessaging);

  useEffect(() => {
    const createAndFetchConversation = async () => {
      const action = await dispatch(createConversationThunk(apiUrl));
      if (createConversationThunk.fulfilled.match(action)) {
        const convAction = await dispatch(getConversationThunk(apiUrl));
        if (getConversationThunk.fulfilled.match(convAction)) {
          const newConversationId = convAction.payload.id;
          dispatch(setConversationId(newConversationId));
          localStorage.setItem("conversationId", newConversationId);
          dispatch(getMessages({ apiUrl, conversationId: newConversationId }));
        }
      } else if (action.payload?.error === "Conversation already exists") {
        const convAction = await dispatch(getConversationThunk(apiUrl));
        if (getConversationThunk.fulfilled.match(convAction)) {
          const existingConversationId = convAction.payload.id;
          dispatch(setConversationId(existingConversationId));
          localStorage.setItem("conversationId", existingConversationId);
          dispatch(getMessages({ apiUrl, conversationId: existingConversationId }));
        }
      } else {
        //console.error("Error creating conversation", action.error);
      }
    };

    if (!conversationId) {
      const storedId = localStorage.getItem("conversationId");
      if (storedId) {
        dispatch(setConversationId(storedId));
        dispatch(getMessages({ apiUrl, conversationId: storedId }));
      } else {
        createAndFetchConversation();
      }
    }
  }, [dispatch, apiUrl, conversationId]);

  
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
    if (!message.trim() || !conversationId) return;
    dispatch(sendMessageToAI({ message, apiUrl, conversationId }));
  };

  return (
    <div
      className={`flex flex-col w-full bg-background ${
        isMobile ? "h-screen" : "h-full max-h-[90%]"
      }`}
    >
      <div
        className={`flex-1 overflow-y-auto flex flex-col ${
          isMobile ? "pb-36" : "pb-0"
        } p-2 md:p-4 space-y-4 relative`}
      >
        {historyLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#8B0000] rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex justify-center items-center text-center px-4">
            <div className="text-muted-foreground">{t("start_conversation")}</div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.isSentByUser ? "justify-end" : "justify-start"
              } items-end gap-1`}
            >
              {/* Yapay zeka mesajı ise logo gösterelim */}
              {!msg.isSentByUser && (
                <img
                  src={IYTElogo}
                  alt="IYTE Logo"
                  className="w-9 h-9 object-contain hidden sm:block"
                />
              )}
              <div
                className={`max-w-[90%] xs:max-w-[80%] p-3 rounded-lg break-words text-sm md:text-base 
                  ${
                    msg.isSentByUser
                      ? "bg-red-800 text-white ml-auto rounded-br-none"
                      : "bg-gray-200 text-foreground mr-auto rounded-bl-none"
                  }`}
              >
                {msg.message}
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

      <div className="sticky bottom-0 border-t p-2 bg-background">
        <div className="max-w-3xl mx-auto w-full">
          <RoundedInput onSend={handleSend} fullWidth disabled={aiLoading} />
        </div>
      </div>
    </div>
  );
};

export default AIComponent;