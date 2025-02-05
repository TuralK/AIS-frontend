import React, { useState, useEffect } from 'react';
import { MessageCircle, X, ChevronUp, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Conversation from './Conversation';
import AIComponent from './AIChatComp';

const Messaging = ({ messages = [], sentMessages = [], hasAITab, userApi }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('odakli');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const groupConversations = (messages, sentMessages) => {
    const grouped = {};

    messages.forEach((message) => {
      if (!grouped[message.from]) {
        grouped[message.from] = {
          from: message.from,
          senderName: message.senderName,
          topic: message.topic || '',
          messages: [],
        };
      }
      grouped[message.from].messages.push({ ...message, type: 'received' });
    });

    sentMessages.forEach((message) => {
      if (!grouped[message.to]) {
        grouped[message.to] = {
          from: message.to,
          senderName: message.receiverName,
          topic: message.topic || '',
          messages: [],
        };
      }
      grouped[message.to].messages.push({ ...message, type: 'sent' });
    });

    return Object.values(grouped).map(conversation => {
      conversation.messages.sort((a, b) => a.id - b.id);
      return conversation;
    }).sort((a, b) => {
      const lastMsgB = b.messages[b.messages.length - 1]?.timestamp || 0;
      return lastMsgB;
    });
  };

  const conversations = groupConversations(messages, sentMessages);

  const toggleMessaging = () => {
    setIsOpen((prev) => !prev);
    setSelectedConversation(null);
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  if (isMobile && !isOpen) {
    return (
      <button onClick={toggleMessaging} className="fixed bottom-4 right-4 z-50 bg-white text-gray-700 rounded-full p-3 shadow-lg border border-gray-300 hover:bg-gray-100 transition-colors">
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className={`fixed ${isMobile ? 'bottom-0 right-0' : 'bottom-0 right-4'} z-55 ${!isOpen && !isMobile ? 'border border-black rounded-lg' : ''}`}>
      {!isOpen && !isMobile && (
        <button onClick={toggleMessaging} className="bg-white text-gray-700 rounded-t-lg px-4 py-2 flex items-center justify-between gap-2 border border-gray-300 hover:bg-gray-100 transition-colors w-64">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <span className="font-semibold truncate">{t('messaging')}</span>
          </div>
          <ChevronUp size={20} />
        </button>
      )}

      {isOpen && (
        <div className={`bg-white border border-gray-300 ${!isMobile ? 'rounded-t-lg shadow-lg' : ''} w-80 ${!isMobile ? 'sm:w-96' : ''} flex flex-col`} style={{ height: !isMobile ? 'calc(100vh - 110px)' : '500px' }}>
          {!selectedConversation ? (
            <>
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  <span className="font-semibold truncate">{t('messaging')}</span>
                </div>
                <button onClick={toggleMessaging} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <div className="flex border-b border-gray-200">
                <button className={`flex-1 py-2 px-4 font-semibold ${activeTab === 'odakli' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('odakli')}>
                  {t('message_tab')}
                </button>
                {hasAITab && (
                  <button className={`flex-1 py-2 px-4 font-semibold ${activeTab === 'diger' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('diger')}>
                    {t('ai_tab')}
                  </button>
                )}
              </div>

              <div className="flex-grow overflow-y-auto p-2">
                {activeTab === 'odakli' ? (
                  conversations.length > 0 ? (
                    conversations.map((conversation) => {
                      const lastReceivedMessage = [...conversation.messages].reverse().find(msg => msg.type === 'received');
                      return (
                        <div key={conversation.from} className="p-4 mb-2 cursor-pointer hover:bg-gray-100 border border-gray-300 rounded-md" onClick={() => handleConversationClick(conversation)}>
                          <div className="font-semibold truncate max-w-full">{conversation.senderName}</div>
                          {conversation.topic && (
                            <div className="flex items-center text-sm text-gray-500 mt-1 truncate max-w-full">
                              <Tag size={14} className="mr-1" />
                              {conversation.topic}
                            </div>
                          )}
                          <div className="text-sm font-bold mt-1 text-gray-900">
                            {lastReceivedMessage?.message || ''}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-500 text-center p-4">{t('no_messages')}</div>
                  )
                ) : (
                  hasAITab && <AIComponent api={userApi} />
                )}
              </div>
            </>
          ) : (
            <Conversation conversation={selectedConversation} onBack={handleBack} />
          )}
        </div>
      )}
    </div>
  );
};

export default Messaging;
