import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const RoundedInput = ({ onSend }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }, [inputValue]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSend(inputValue); // Send input value to parent
      setInputValue(''); // Clear input
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Detect Enter key (without Shift)
      e.preventDefault(); // Prevent default newline behavior
      handleSendMessage(); // Send message
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center overflow-hidden">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown} // Add keydown handler
          placeholder="Type your message..."
          className="flex-grow ml-1 px-2 py-2 border-2 border-gray-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          style={{ minHeight: '40px', maxHeight: '120px', marginTop: '3px', marginBottom: '3px' }}
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          className="w-12 h-12 bg-red-900 ml-1 text-white rounded-full flex items-center justify-center transition-colors hover:bg-red-1000"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default RoundedInput;