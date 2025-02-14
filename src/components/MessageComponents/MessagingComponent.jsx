import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MessageCircle, X, ChevronUp, UserPlus } from "lucide-react"
import { useTranslation } from "react-i18next"
import Conversation from "./Conversation"
import AIComponent from "./AIChatComp"
import PollingComponent from "../PollingComponent"
import { fetchConversationsThunk, fetchUsersThunk, createConversationThunk } from "../../thunks/messageThunks"
import { cn } from "../../utils/utils"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll_area"
import { UserAvatar } from "./UserAvatar"

const Messaging = ({ hasAITab, apiUrl, isOpen, onToggle }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { conversations, loading, error, users, usersLoading } = useSelector((state) => state.messaging)
  const [activeTab, setActiveTab] = useState("odakli")
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showUsersList, setShowUsersList] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    dispatch(fetchUsersThunk(apiUrl))
    dispatch(fetchConversationsThunk(apiUrl))
  }, [dispatch, apiUrl])

  const hasExistingConversation = (userEmail) => {
    return conversations.some(conv => conv.user1_email === userEmail || conv.user2_email === userEmail)
  }

  const filteredUsers = users.filter(user => 
    (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )).filter(user => !hasExistingConversation(user.email))

  const handleCreateConversation = async (user) => {
    await dispatch(createConversationThunk({
      apiUrl,
      receiverEmail: user.email,
      receiverName: user.username,
    }))
    setShowUsersList(false)
    setSearchTerm("")
  }

  const toggleMessaging = () => {
    onToggle(!isOpen)
    setSelectedConversation(null)
    setShowUsersList(false)
  }

  if (isMobile && !isOpen) {
    return (
      <button
        onClick={toggleMessaging}
        className="fixed bottom-4 right-4 z-50 bg-white text-gray-700 rounded-full p-3 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <MessageCircle size={24} />
      </button>
    )
  }

  return (
    <div className={cn(
      "fixed z-50",
      isMobile ? "bottom-0 right-0 left-0" : "bottom-0 right-4",
      !isOpen && !isMobile && "w-64",
    )}>
      {!isOpen && !isMobile && (
        <button
          onClick={toggleMessaging}
          className="w-full bg-white text-gray-700 rounded-t-lg px-4 py-2.5 flex items-center justify-between border border-gray-800 hover:bg-gray-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-gray-600" />
            <span className="font-medium font-semibold text-gray-900">{t("messaging")}</span>
          </div>
          <ChevronUp size={18} className="text-gray-500" />
        </button>
      )}

      {isOpen && (
        <div className={cn(
          "bg-white border border-gray-200 flex flex-col",
          isMobile ? "fixed left-4 right-3 bottom-1 rounded-lg shadow-xl" : "rounded-t-lg shadow-xl w-[380px]",
        )}
        style={{
          height: isMobile ? "auto" : "calc(100vh - 110px)",
          maxHeight: isMobile ? "calc(100vh - 100px)" : "calc(100vh - 110px)",
        }}>
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-blue-600" />
              <span className="font-medium text-gray-900">{t("messaging")}</span>
            </div>
            <button
              onClick={toggleMessaging}
              className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {hasAITab && (
            <div className="flex border-b border-gray-200">
              <button
                className={cn(
                  "flex-1 py-2.5 px-4 font-medium text-sm transition-colors relative",
                  activeTab === "odakli"
                    ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                    : "text-gray-600 hover:text-blue-600",
                )}
                onClick={() => {
                  setActiveTab("odakli")
                  setShowUsersList(false)
                  setSelectedConversation(null)
                }}>
                {t("message_tab")}
              </button>
              <button
                className={cn(
                  "flex-1 py-2.5 px-4 font-medium text-sm transition-colors relative",
                  activeTab === "diger"
                    ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                    : "text-gray-600 hover:text-blue-600",
                )}
                onClick={() => {
                  setActiveTab("diger")
                  setShowUsersList(false)
                  setSelectedConversation(null)
                }}>
                {t("ai_tab")}
              </button>
            </div>
          )}

          {!selectedConversation && activeTab === "odakli" ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm">
                  <Input
                    type="text"
                    placeholder={showUsersList ? t("search_users") : t("search_conversations")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <button
                    onClick={() => {
                      setShowUsersList(prev => !prev)
                      setSearchTerm("")
                    }}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      showUsersList
                        ? "text-blue-600 hover:bg-blue-50"
                        : "text-gray-400 hover:text-blue-600 hover:bg-gray-100",
                    )}
                    title={showUsersList ? t("show_conversations") : t("new_conversation")}>
                    <UserPlus size={20} />
                  </button>
                </div>
              </div>
              <ScrollArea className="flex-1 overflow-y-auto" style={{ maxHeight: isMobile ? "calc(100vh - 280px)" : undefined }}>
                <div className="p-3">
                  {(loading || usersLoading) ? (
                    <div className="h-full flex items-center justify-center min-h-[200px]">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#8B0000] rounded-full animate-spin"></div>
                    </div>
                  ) : error ? (
                    <p className="text-sm text-red-500 text-center py-4">{t("error")}</p>
                  ) : showUsersList ? (
                    <div className="space-y-2">
                      {filteredUsers.map(user => (
                        <div
                          key={user.email}
                          onClick={() => handleCreateConversation(user)}
                          className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all shadow-sm">
                          <div className="flex items-center gap-3">
                            <UserAvatar email={user.email} />
                            <div>
                              <div className="font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500 mt-1">{user.email}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {conversations.length > 0 ? (
                        conversations
                          .filter(conv => conv.user2_name.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map(conv => (
                            <div
                              key={conv.id}
                              onClick={() => setSelectedConversation(conv)}
                              className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all shadow-sm">
                              <div className="flex items-center gap-3">
                                <UserAvatar email={conv.user2_email} />
                                <div>
                                  <div className="font-medium text-gray-900">{conv.user2_name}</div>
                                  {conv.topic && (
                                    <div className="text-sm text-gray-500 mt-2 bg-gray-50 px-2 py-1 rounded-md">
                                      {conv.topic}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="h-full flex items-center justify-center min-h-[200px]">
                          <p className="text-sm text-gray-500 text-center">{t("no_conversation")}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : selectedConversation && (
            <Conversation
              conversation={selectedConversation}
              onBack={() => setSelectedConversation(null)}
              apiUrl={apiUrl}
            />
          )}

          {hasAITab && activeTab === "diger" && <AIComponent apiUrl={apiUrl} />}
        </div>
      )}
      <PollingComponent apiUrl={apiUrl} />
    </div>
  )
}

export default Messaging