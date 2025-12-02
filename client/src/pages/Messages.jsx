import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../utils/api';
import Loader from '../components/ui/Loader';
import { useSnackbar } from '../utils/useSnackbar';
import Snackbar from '../components/ui/Snackbar';
import useAudio from '../hooks/useAudio';

const Messages = () => {
  const { user } = useAuth();
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar();
  const { playSendSound, playReceiveSound } = useAudio();
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('conversations');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastNotificationRef = useRef(null);
  const previousUnreadCountRef = useRef(0);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';


  useEffect(() => {
    initializeMessages();
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Handle selected user changes
  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.id);
      // Set up polling for new messages
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      pollingIntervalRef.current = setInterval(() => {
        loadMessages(selectedUser.id, true);
        loadConversations();
      }, 5000);
    } else {
      // Clear polling if no user is selected
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [selectedUser]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeMessages = async () => {
    try {
      setIsLoading(true);
      await Promise.all([loadConversations(), loadAllUsers()]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const response = await api.getUsers();
      if (response.success) {
        const filteredUsers = (response.data || []).filter(u => u.id !== user?.userId);
        setAllUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Failed to load all users:', error);
      showError('Failed to load users');
    }
  };

  const loadConversations = async () => {
    try {
      const response = await api.getConversations();
      if (response.success) {
        setConversations(response.data || []);

        // Check for new unread messages and show notification
        const totalUnread = (response.data || []).reduce((sum, conv) => sum + conv.unreadCount, 0);
        
        // Only show notification if unread count increased
        if (totalUnread > previousUnreadCountRef.current) {
          const newUnreadConversations = (response.data || [])
            .filter(conv => conv.unreadCount > 0)
            .slice(0, 1); // Show notification for first unread conversation

          if (newUnreadConversations.length > 0) {
            const conv = newUnreadConversations[0];
            const notificationKey = `${conv.user.id}-${conv.lastMessage?.id}`;

            // Avoid duplicate notifications
            if (lastNotificationRef.current !== notificationKey) {
              lastNotificationRef.current = notificationKey;
              playReceiveSound(); // Play receive notification sound
              const senderName = `${conv.user.firstName} ${conv.user.lastName}`;
              const messagePreview = conv.lastMessage?.content || '📎 File attachment';
              showSuccess(`New message from ${senderName}: ${messagePreview}`);
            }
          }
        }

        previousUnreadCountRef.current = totalUnread;
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (otherUserId, isSilent = false) => {
    try {
      if (!isSilent) {
        setIsLoadingMessages(true);
      }
      const response = await api.getMessages(otherUserId);
      if (response.success) {
        setMessages(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      if (!isSilent) {
        showError('Failed to load messages');
      }
    } finally {
      if (!isSilent) {
        setIsLoadingMessages(false);
      }
    }
  };

  const handleSelectUser = async (conversation) => {
    setSelectedUser(conversation.user);
    setActiveTab('conversations');
  };

  const handleSelectNewUser = (newUser) => {
    setSelectedUser(newUser);
    setActiveTab('conversations');
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      showError('Maximum 5 files allowed');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(f => f.size > maxSize);
    if (oversizedFiles.length > 0) {
      showError('Files must be smaller than 5MB');
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim() && selectedFiles.length === 0) {
      showError('Please enter a message or attach a file');
      return;
    }

    if (!selectedUser) {
      showError('Please select a user to send message');
      return;
    }

    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('receiverId', selectedUser.id);

      if (messageText.trim()) {
        formData.append('content', messageText.trim());
      }

      selectedFiles.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await api.sendMessage(formData);
      if (response.success) {
        playSendSound(); // Play send notification
        setMessageText('');
        setSelectedFiles([]);
        await loadMessages(selectedUser.id);
        await loadConversations();
        showSuccess('Message sent successfully');
      } else {
        showError(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      showError(error.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) {
      return 'Just now';
    }
    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    if (days < 7) {
      return `${days}d ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return 'fa-file-image';
    if (fileType.includes('pdf')) return 'fa-file-pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'fa-file-word';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'fa-file-excel';
    if (fileType.includes('zip')) return 'fa-file-archive';
    return 'fa-file';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredUsers = allUsers.filter(u => {
    const query = searchQuery.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(query) ||
      u.lastName.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  });

  const filteredConversations = conversations.filter(conv => {
    const query = searchQuery.toLowerCase();
    return (
      conv.user.firstName.toLowerCase().includes(query) ||
      conv.user.lastName.toLowerCase().includes(query) ||
      conv.user.email.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="h-[calc(95vh-80px)] flex bg-gray-50 gap-4 p-4">
      {/* Sidebar - Collapsible */}
      <div className={`flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isSidebarOpen ? 'w-80' : 'w-0 p-0'
      }`}>
        <div className="p-4 border-b border-gray-200 bg-linear-to-r from-blue-600 to-purple-600 flex-shrink-0">
          <h2 className="text-xl font-bold text-white mb-3">Messages</h2>
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={() => setActiveTab('conversations')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'conversations'
                ? 'text-blue-600 border-b-2 border-b-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-comments mr-2"></i>
            Conversations {conversations.length > 0 && `(${conversations.length})`}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-b-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-users mr-2"></i>
            Users {allUsers.length > 0 && `(${allUsers.length})`}
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'conversations' ? (
            filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                <p className="font-medium">No conversations</p>
                <p className="text-sm mt-1">Start a conversation from the Users tab</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.user.id}
                  onClick={() => handleSelectUser(conv)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50 ${
                    selectedUser?.id === conv.user.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-md">
                        {conv.user.profilePicture ? (
                          <img
                            src={`${API_BASE}${conv.user.profilePicture}`}
                            alt={`${conv.user.firstName} ${conv.user.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {conv.user.firstName?.[0]}{conv.user.lastName?.[0]}
                          </span>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold text-gray-900 truncate ${
                          conv.unreadCount > 0 ? 'font-bold' : ''
                        }`}>
                          {conv.user.firstName} {conv.user.lastName}
                        </h3>
                        {conv.lastMessage && (
                          <span className={`text-xs shrink-0 ml-2 ${
                            conv.unreadCount > 0 ? 'text-blue-600 font-semibold' : 'text-gray-500'
                          }`}>
                            {formatTime(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm truncate ${
                        conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}>
                        {conv.lastMessage?.content || '📎 File attachment'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <i className="fas fa-user-slash text-4xl mb-3 text-gray-300"></i>
                <p className="font-medium">No users found</p>
                <p className="text-sm mt-1">Try a different search</p>
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleSelectNewUser(u)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-green-50 ${
                    selectedUser?.id === u.id ? 'bg-green-50 border-l-4 border-l-green-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-md">
                      {u.profilePicture ? (
                        <img
                          src={`${API_BASE}${u.profilePicture}`}
                          alt={`${u.firstName} ${u.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {u.firstName?.[0]}{u.lastName?.[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {u.firstName} {u.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{u.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.role === 'SUPERADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'ADMIN'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="mt-4 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors shrink-0 h-fit"
        title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <i className={`fas ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-gray-600 text-lg`}></i>
      </button>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 font-bold overflow-hidden">
                  {selectedUser.profilePicture ? (
                    <img
                      src={`${API_BASE}${selectedUser.profilePicture}`}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-white/80 text-sm">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <i className="fas fa-comment-medical text-4xl mb-3 text-gray-300"></i>
                    <p className="font-medium">No messages yet</p>
                    <p className="text-sm mt-1">Send a message to start the conversation</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.senderId === user?.userId;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div className={`max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 shadow-sm ${
                            isOwnMessage
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          {message.content && (
                            <p className="break-words whitespace-pre-wrap">{message.content}</p>
                          )}

                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {message.attachments.map((attachment) => {
                                const isImage = attachment.fileType.includes('image');
                                return (
                                  <div key={attachment.id}>
                                    {isImage ? (
                                      <a
                                        href={`${API_BASE}${attachment.fileUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                      >
                                        <img
                                          src={`${API_BASE}${attachment.fileUrl}`}
                                          alt={attachment.fileName}
                                          className="rounded-lg max-w-full max-h-96 cursor-pointer hover:opacity-90 transition-opacity"
                                        />
                                      </a>
                                    ) : (
                                      <a
                                        href={`${API_BASE}${attachment.fileUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-2 p-3 rounded-lg transition-all hover:opacity-90 ${
                                          isOwnMessage ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                      >
                                        <i className={`fas ${getFileIcon(attachment.fileType)} text-lg flex-shrink-0`}></i>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                                          <p className="text-xs opacity-75">{formatFileSize(attachment.fileSize)}</p>
                                        </div>
                                        <i className="fas fa-download flex-shrink-0"></i>
                                      </a>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <p className={`text-xs mt-1 px-2 ${
                          isOwnMessage ? 'text-right text-gray-600' : 'text-left text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
              {selectedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm"
                    >
                      <i className={`fas ${getFileIcon(file.type)} text-blue-600`}></i>
                      <span className="max-w-[150px] truncate text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Attach file (max 5 files, 5MB each)"
                >
                  <i className="fas fa-paperclip text-xl"></i>
                </button>

                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type a message... (Shift+Enter for new line)"
                  className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="1"
                  style={{ maxHeight: '120px' }}
                />

                <button
                  type="submit"
                  disabled={isSending || (!messageText.trim() && selectedFiles.length === 0)}
                  className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  title="Send message"
                >
                  {isSending ? (
                    <i className="fas fa-spinner fa-spin text-xl"></i>
                  ) : (
                    <i className="fas fa-paper-plane text-xl"></i>
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50">
            <div className="text-center">
              <i className="fas fa-comments text-6xl mb-4 text-gray-300"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No conversation selected</h3>
              <p className="text-gray-500">Choose a conversation from the left or start a new one with a user</p>
            </div>
          </div>
        )}
      </div>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        open={snackbar.open}
        onClose={hideSnackbar}
        position="top-right"
      />
    </div>
  );
};

export default Messages;
