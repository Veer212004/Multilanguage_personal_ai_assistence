import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Clock, Download, Search, RefreshCw, AlertCircle, Eye, ChevronDown, ChevronRight } from 'lucide-react';

const ConversationHistory = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [expandedConversations, setExpandedConversations] = useState(new Set());
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    withUser: 0
  });

  const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://loanplatform.onrender.com';

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Fetching conversations from:', `${API_BASE}/api/chatbot/conversations/all`);
      
      const response = await fetch(`${API_BASE}/api/chatbot/conversations/all`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Conversations data:', data);
        
        const conversationList = data.conversations || [];
        setConversations(conversationList);
        
        // Calculate stats
        setStats({
          total: conversationList.length,
          active: conversationList.filter(c => c.isActive).length,
          withUser: conversationList.filter(c => c.userEmail).length
        });
        
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to fetch conversations:', errorData);
        setError(`Failed to load conversations: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error fetching conversations:', error);
      setError(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // View specific conversation
  const viewConversation = async (sessionId) => {
    try {
      console.log('👁️ Viewing conversation:', sessionId);
      
      const response = await fetch(`${API_BASE}/api/chatbot/conversation/${sessionId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Conversation details:', data);
        setSelectedConversation(data.conversation);
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to fetch conversation details:', errorData);
        setError(`Failed to load conversation: ${errorData.message}`);
      }
    } catch (error) {
      console.error('❌ Error fetching conversation details:', error);
      setError(`Failed to load conversation details: ${error.message}`);
    }
  };

  // Toggle conversation expansion
  const toggleConversation = (conversationId) => {
    const newExpanded = new Set(expandedConversations);
    if (newExpanded.has(conversationId)) {
      newExpanded.delete(conversationId);
    } else {
      newExpanded.add(conversationId);
      // Fetch conversation details when expanding
      const conversation = conversations.find(c => c._id === conversationId);
      if (conversation) {
        viewConversation(conversation.sessionId);
      }
    }
    setExpandedConversations(newExpanded);
  };

  // Test connection and create sample data
  const createSampleConversation = async () => {
    try {
      console.log('🧪 Creating sample conversation...');
      
      const sessionId = 'sample_' + Date.now();
      
      // Create conversation
      const startResponse = await fetch(`${API_BASE}/api/chatbot/conversation/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sessionId: sessionId,
          userEmail: 'demo@example.com',
          userAgent: 'Demo Browser'
        })
      });
      
      if (startResponse.ok) {
        // Add sample messages
        const messages = [
          { text: 'Hello, I need help with a loan', type: 'user' },
          { text: 'Hi! I can help you with loan information. What type of loan are you interested in?', type: 'bot' },
          { text: 'I want a personal loan for ₹50,000', type: 'user' },
          { text: 'Great! For a personal loan of ₹50,000, here are your options:\n\n1. Interest rates: 10.5% - 15%\n2. Tenure: 1-5 years\n3. Processing fee: 1-3%\n\nWould you like me to help you apply?', type: 'bot' },
          { text: 'Yes, please help me apply', type: 'user' },
          { text: 'Perfect! I\'ll need some basic information to get started. Can you please provide:\n\n• Your monthly income\n• Employment status\n• Any existing loans', type: 'bot' }
        ];
        
        for (let i = 0; i < messages.length; i++) {
          const msg = messages[i];
          await fetch(`${API_BASE}/api/chatbot/conversation/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              sessionId: sessionId,
              message: msg.text,
              messageType: msg.type,
              messageId: `${msg.type}_${Date.now()}_${i}`
            })
          });
          
          // Small delay between messages
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log('✅ Sample conversation created!');
        fetchConversations(); // Refresh the list
      }
    } catch (error) {
      console.error('❌ Failed to create sample conversation:', error);
    }
  };

  // Export conversation
  const exportConversation = (conversation, event) => {
    event.stopPropagation(); // Prevent row expansion
    
    const exportData = {
      sessionId: conversation.sessionId,
      startedAt: conversation.startedAt,
      lastActivity: conversation.lastActivity,
      userEmail: conversation.userEmail,
      isActive: conversation.isActive,
      messageCount: conversation.messageCount || conversation.messages?.length || 0,
      messages: conversation.messages || []
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation_${conversation.sessionId}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.sessionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageCircle className="text-blue-600" />
          Chatbot Conversations
          <button
            onClick={fetchConversations}
            className="ml-auto p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Refresh conversations"
          >
            <RefreshCw size={20} />
          </button>
        </h1>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-800">Total Conversations</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-green-800">Active Sessions</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.withUser}</div>
            <div className="text-sm text-purple-800">Registered Users</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <button
              onClick={createSampleConversation}
              className="w-full text-orange-600 hover:text-orange-700 font-medium"
            >
              + Create Sample
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button
              onClick={fetchConversations}
              className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search conversations by session ID or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* No conversations message */}
      {!loading && filteredConversations.length === 0 && !error && (
        <div className="text-center py-12">
          <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'No conversations match your search criteria.' 
              : 'No chatbot conversations have been recorded yet.'}
          </p>
          <button
            onClick={createSampleConversation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Sample Conversation
          </button>
        </div>
      )}

      {/* Conversations List */}
      {filteredConversations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              Conversations ({filteredConversations.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => {
              const isExpanded = expandedConversations.has(conversation._id);
              const conversationDetails = selectedConversation?.sessionId === conversation.sessionId 
                ? selectedConversation 
                : null;
              
              return (
                <div key={conversation._id || conversation.sessionId}>
                  {/* Conversation Header */}
                  <div
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => toggleConversation(conversation._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400">
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            Session: {conversation.sessionId?.substring(0, 30)}...
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(conversation.startedAt).toLocaleString()}
                            </span>
                            <span>
                              {conversation.messageCount || conversation.messages?.length || 0} messages
                            </span>
                            {conversation.userEmail && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <User size={12} />
                                {conversation.userEmail}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          conversation.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {conversation.isActive ? 'Active' : 'Ended'}
                        </span>
                        <button
                          onClick={(e) => exportConversation(conversation, e)}
                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                          title="Export conversation"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Conversation Details */}
                  {isExpanded && (
                    <div className="bg-gray-50 border-t border-gray-200">
                      {conversationDetails ? (
                        <div className="p-4">
                          <div className="mb-4 text-sm text-gray-600">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>Started: {new Date(conversationDetails.startedAt).toLocaleString()}</div>
                              <div>Last Activity: {new Date(conversationDetails.lastActivity).toLocaleString()}</div>
                              <div>Status: <span className={conversationDetails.isActive ? 'text-green-600' : 'text-gray-600'}>
                                {conversationDetails.isActive ? 'Active' : 'Ended'}
                              </span></div>
                            </div>
                          </div>
                          
                          {/* Messages */}
                          <div className="max-h-96 overflow-y-auto space-y-3 bg-white p-4 rounded-lg">
                            {conversationDetails.messages?.length > 0 ? (
                              conversationDetails.messages.map((message, index) => (
                                <div
                                  key={message.messageId || index}
                                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                      message.type === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                    }`}
                                  >
                                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                                    <div className={`text-xs mt-1 ${
                                      message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                                    }`}>
                                      {new Date(message.timestamp).toLocaleTimeString()} 
                                      {message.messageId && (
                                        <span className="ml-2 opacity-60">ID: {message.messageId.substring(0, 8)}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center text-gray-500 py-4">
                                No messages in this conversation
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          Loading conversation details...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;