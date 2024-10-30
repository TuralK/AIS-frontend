import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RoundedInput from './MessageInputComp';

const AIComponent = ({ onBack }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [aiResponses, setAiResponses] = useState([]);
  const { t } = useTranslation();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }, [inputMessage]);

  const handleSend = (message) => {
    console.log("AI chat comp:"+message);
    if (inputMessage.trim()) {
      const newResponse = `AI response to: ${inputMessage}`;
      setAiResponses((prevResponses) => [...prevResponses, newResponse]);
      setInputMessage(''); // Clear input
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4">
        {aiResponses.length > 0 ? (
          aiResponses.map((response, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded-lg mb-2">
              {response}
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            {t('start_conversation')}
          </div>
        )}
      </div>
      <div className="p-2">
        <RoundedInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default AIComponent;
