import React, { useState, useEffect } from 'react';
import { MessageCircle, X, ChevronUp, Tag, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Conversation from './Conversation';
import AIComponent from './AIChatComp';
import { groupConversations, checkIsMobile } from '../../utils/messageUtils';
import { getMessages, getSentMessages } from '../../api/messageApi';

const Messaging = ({ hasAITab, userApi, apiUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('odakli');
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    checkIsMobile(setIsMobile);
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      const data = await getMessages(`${apiUrl}/messages`);
      const dataSent = await getSentMessages(`${apiUrl}/sentMessages`);
      setMessages(data);
      setSentMessages(dataSent);
    }

    fetchMessages();
  }, [selectedConversation]);

  useEffect(() => {
    setFilteredConversations(
      groupConversations(messages, sentMessages).filter(conversation =>
        conversation.senderName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        conversation.receiverName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, messages, sentMessages]);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

              <div className="flex-grow overflow-y-auto">
                {activeTab === 'odakli' ? (
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200">
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder={t('search_users')}
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    
                    <div className="flex-grow overflow-y-auto p-2">
                      {filteredConversations.length > 0 ? (
                        filteredConversations.map((conversation) => {
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
                              <div className="text-sm font-bold mt-1 text-gray-500">
                                {lastReceivedMessage?.message || ''}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-gray-500 text-center p-4">{t('no_messages')}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  hasAITab && <AIComponent api={userApi} />
                )}
              </div>
            </>
          ) : (
            <Conversation conversation={selectedConversation} onBack={handleBack} apiUrl={apiUrl} />
          )}
        </div>
      )}
    </div>
  );
};

export default Messaging;