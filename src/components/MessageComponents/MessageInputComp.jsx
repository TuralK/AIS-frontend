import React, { useState, useRef, useEffect } from "react"
import { ArrowUp, Square } from "lucide-react"
import { useTranslation } from "react-i18next"

const RoundedInput = ({ onSend, attachedFile }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]); 

  const handleSendMessage = async () => {
    
    if (!inputValue.trim() && !attachedFile) return;

    setIsLoading(true);
    try {
      await onSend(inputValue);
      setInputValue(""); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-full mx-auto px-1">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("type_message")}
          disabled={isLoading}
          className="w-full bg-white border-b border-gray-800 text-black rounded-2xl px-4 py-3 pr-10 min-h-[60px] max-h-[200px] resize-none overflow-y-auto focus:outline-none focus:ring-1 focus:ring-zinc-700 scrollbar-hidden disabled:opacity-50"
          rows={2}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="absolute bottom-4 right-2 w-10 h-10 bg-black rounded-full flex items-center justify-center transition-colors hover:bg-zinc-500 active:bg-zinc-200 disabled:cursor-not-allowed"
          aria-label={isLoading ? "Sending message" : "Send message"}
        >
          {isLoading ? <Square className="w-4 h-4 text-white" /> : <ArrowUp className="w-6 h-6 text-white" />}
        </button>
      </div>
    </div>
  );
};


export default RoundedInput