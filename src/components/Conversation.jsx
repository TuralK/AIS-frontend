import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RoundedInput from './MessageInputComp';

const Conversation = ({ message, onBack }) => {
  const [inputMessage, setInputMessage] = useState('');
  const { t } = useTranslation();
  
  const handleSend = (message) => {
    console.log("AI chat comp:"+message);
    if (inputMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </button>
          <span className="font-semibold">{t('conversation')}</span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        <h3 className="font-semibold mb-2">{t('selected_message')}</h3>
        <p>{message.text}</p>
        {/* Add more conversation details here */}
      </div>
      <div className="p-2">
        <RoundedInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default Conversation;