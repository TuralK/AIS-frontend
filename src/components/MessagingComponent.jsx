import React, { useState } from 'react';
import { MessageCircle, X, Edit, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Conversation from './Conversation';
import AIComponent from './AIChatComp'; // Import the AIComponent

const Messaging = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('odakli');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { t } = useTranslation();

  const messages = [
    { id: 1, text: 'Merhaba, nasıl yardımcı olabilirim?' },
    { id: 2, text: 'Hesabımda sorun var.' },
    { id: 3, text: 'Yeni ürünler hakkında bilgi almak istiyorum.' },
    { id: 4, text: 'Yeni ürünler hakkında bilgi almak istiyorum.' },
  ];

  const toggleMessaging = () => {
    setIsOpen(prev => !prev);
    setSelectedMessage(null);
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
  };

  const handleBack = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="fixed bottom-0 right-4 z-50 border border-black rounded-lg">
      {!isOpen && (
        <button
          onClick={toggleMessaging}
          className="bg-white text-gray-700 rounded-t-lg px-4 py-2 flex items-center justify-between gap-2 border border-gray-300 hover:bg-gray-100 transition-colors w-64"
        >
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <span className="font-semibold">{t('messaging')}</span>
          </div>
          <ChevronUp size={20} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white border border-gray-300 rounded-t-lg shadow-lg w-80 sm:w-96 flex flex-col" style={{ height: 'calc(100vh - 100px)' }}>
          {!selectedMessage ? (
            <>
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  <span className="font-semibold">{t('messaging')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    <Edit size={20} />
                  </button>
                  <button onClick={toggleMessaging} className="text-gray-500 hover:text-gray-700">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex border-b border-gray-200">
                <button
                  className={`flex-1 py-2 px-4 font-semibold ${activeTab === 'odakli' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('odakli')}
                >
                  {t('message_tab')}
                </button>
                <button
                  className={`flex-1 py-2 px-4 font-semibold ${activeTab === 'diger' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('diger')}
                >
                  {t('ai_tab')}
                </button>
              </div>

              <div className="flex-grow overflow-y-auto">
                {activeTab === 'odakli' ? (
                  messages.length > 0 ? (
                    messages.map(message => (
                      <div
                        key={message.id}
                        className="p-4 cursor-pointer hover:bg-gray-100 border-b border-gray-200"
                        onClick={() => handleMessageClick(message)}
                      >
                        {message.text}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center p-4">{t('no_messages')}</div>
                  )
                ) : (
                  <AIComponent /> // Render the AIComponent when "diger" tab is active
                )}
              </div>
            </>
          ) : (
            <Conversation message={selectedMessage} onBack={handleBack} />
          )}
        </div>
      )}
    </div>
  );
};

export default Messaging;
