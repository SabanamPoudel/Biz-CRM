"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api-config";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settingsTab, setSettingsTab] = useState('company-info');
  const [expandedMenus, setExpandedMenus] = useState<{[key: string]: boolean}>({});
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: Date}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Array<{
    id: string;
    title: string;
    messages: Array<{role: 'user' | 'assistant', content: string, timestamp: Date}>;
    createdAt: Date;
  }>>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    
    // Add user message
    setChatMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response (you can replace this with actual API call)
    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (question: string): string => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('advertise') || lowerQ.includes('marketing')) {
      return "Great question about advertising! Here are some effective strategies for your business:\n\n1. **Digital Marketing**: Start with social media platforms like LinkedIn, Facebook, and Instagram\n2. **Content Marketing**: Create valuable blog posts and videos\n3. **SEO**: Optimize your website for search engines\n4. **Email Marketing**: Build an email list and send regular newsletters\n5. **Paid Ads**: Consider Google Ads or social media advertising\n\nWould you like me to elaborate on any of these strategies?";
    }
    
    if (lowerQ.includes('annual report') || lowerQ.includes('documents')) {
      return "For filing your Annual Report, you'll typically need:\n\n1. **Company Information**: Legal name, address, and state of formation\n2. **Registered Agent**: Name and address of your registered agent\n3. **Officers/Directors**: Names and addresses of company officers\n4. **Business Activity**: Description of your business activities\n5. **Financial Statements**: May be required depending on your state\n\nThe specific requirements vary by state. Which state is your company registered in?";
    }
    
    if (lowerQ.includes('bank account') || lowerQ.includes('ssn')) {
      return "Yes, you can open a US business bank account without an SSN! Here's how:\n\n1. **Use your EIN**: Your Employer Identification Number can substitute for an SSN\n2. **ITIN**: If you don't have an SSN, you can apply for an Individual Taxpayer Identification Number\n3. **Bank Options**: Mercury, Relay, and Brex are popular options for non-US residents\n4. **Required Documents**: You'll need your EIN letter, Articles of Organization, and ID\n\nWould you like recommendations for specific banks that work well with international founders?";
    }
    
    if (lowerQ.includes('tax') || lowerQ.includes('taxes')) {
      return "I can help with tax-related questions! As a US business, you'll need to consider:\n\n1. **Federal Taxes**: File annually with the IRS\n2. **State Taxes**: Depends on your state of formation and operation\n3. **Sales Tax**: If you sell products or services\n4. **Quarterly Estimates**: May be required if you expect to owe over $1,000\n\nWhat specific tax question can I help you with?";
    }
    
    if (lowerQ.includes('ein') || lowerQ.includes('tax id')) {
      return "An EIN (Employer Identification Number) is your business's tax ID. Here's what you need to know:\n\n1. **Purpose**: Required for taxes, hiring employees, and opening bank accounts\n2. **How to Get**: Apply free through the IRS website\n3. **Timeline**: Usually instant online, or 4-5 weeks by mail\n4. **Cost**: Free from the IRS (beware of third-party fees)\n\nDo you need help applying for an EIN?";
    }
    
    if (lowerQ.includes('help') || lowerQ.includes('support') || lowerQ.includes('human')) {
      return "I'd be happy to connect you with our human support team! They can provide personalized assistance with:\n\n- Complex legal questions\n- Specific filing requirements\n- Account-specific issues\n- Custom business advice\n\nWould you like me to create a support ticket for you? Just let me know what you need help with!";
    }
    
    // Default response
    return "That's a great question! I'm here to help you with:\n\n- Business formation and compliance\n- Tax filing and requirements\n- Banking and financial setup\n- Marketing and growth strategies\n- Document preparation\n- Annual reports and maintenance\n\nCould you provide more details about your question so I can give you the most helpful answer?";
  };

  const handleNewChat = () => {
    // Save current conversation if it has messages
    if (chatMessages.length > 0) {
      const conversationTitle = chatMessages[0]?.content.substring(0, 50) + (chatMessages[0]?.content.length > 50 ? '...' : '');
      const newConversation = {
        id: Date.now().toString(),
        title: conversationTitle,
        messages: [...chatMessages],
        createdAt: new Date()
      };
      setConversations(prev => [newConversation, ...prev]);
    }
    
    setChatMessages([]);
    setChatInput('');
    setCurrentConversationId(null);
  };

  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setChatMessages([...conversation.messages]);
      setCurrentConversationId(conversationId);
    }
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (currentConversationId === conversationId) {
      setChatMessages([]);
      setCurrentConversationId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
    .then(r => {
      if (!r.ok) {
        throw new Error('Unauthorized');
      }
      return r.json();
    })
    .then(data => {
      console.log('User data from /auth/me:', data);
      setUser(data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('token');
      router.push('/login');
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">
            BizzCRM
          </h1>
          <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'leads' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Leads</span>
          </button>

          {/* Services with Submenu */}
          <div>
            <button 
              onClick={() => toggleMenu('services')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${activeTab === 'services' || activeTab === 'plans' || activeTab === 'company-types' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Services</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedMenus['services'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedMenus['services'] && (
              <div className="ml-8 mt-1 space-y-1">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'services' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Services</span>
                </button>
                <button
                  onClick={() => setActiveTab('plans')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'plans' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Plans & Pricing</span>
                </button>
                <button
                  onClick={() => setActiveTab('company-types')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'company-types' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Company Types</span>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setActiveTab('company')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'company' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Companies</span>
          </button>

          {/* User Management with Submenu */}
          <div>
            <button 
              onClick={() => toggleMenu('user-management')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${activeTab === 'user-management' || activeTab === 'staffs' || activeTab === 'users' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>User Management</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedMenus['user-management'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedMenus['user-management'] && (
              <div className="ml-8 mt-1 space-y-1">
                <button
                  onClick={() => setActiveTab('staffs')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'staffs' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Staffs</span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'users' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>Users</span>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'tasks' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>Tasks</span>
          </button>

          <button 
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'documents' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Document Approval</span>
          </button>

          {/* Settings with Submenu */}
          <div>
            <button 
              onClick={() => toggleMenu('settings')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${activeTab.startsWith('settings') ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedMenus['settings'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedMenus['settings'] && (
              <div className="ml-8 mt-1 space-y-1">
                <button
                  onClick={() => setActiveTab('settings-general')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'settings-general' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  General
                </button>

                <button
                  onClick={() => setActiveTab('settings-finance')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'settings-finance' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Finance
                </button>

                <button
                  onClick={() => setActiveTab('settings-personalization')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'settings-personalization' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Personalization
                </button>

                <button
                  onClick={() => setActiveTab('settings-notifications')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'settings-notifications' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Notifications
                </button>

                <button
                  onClick={() => setActiveTab('settings-others')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'settings-others' ? 'bg-[#e7edfc] text-[#003174] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Others
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 overflow-y-auto bg-gray-50">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-96 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 pl-4 border-l border-gray-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate capitalize">{user.role || 'User'}</p>
                  </div>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveTab('profile');
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveTab('change-password');
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <span>Change Password</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveTab('account-settings');
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Account Settings</span>
                    </button>

                    <div className="border-t border-gray-200 my-1"></div>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Co-Founder Content */}
          {activeTab === 'co-founder' && (
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_7098_9505)">
                        <path d="M15.0884 5.3624H9.70505V2.91951C10.2403 2.66856 10.6124 2.149 10.6124 1.54017C10.6124 0.689667 9.89022 0 8.99963 0C8.10903 0 7.38686 0.689667 7.38686 1.54017C7.38686 2.14816 7.75896 2.66858 8.2942 2.91951V5.3624H2.91085C2.13136 5.3624 1.5 5.96534 1.5 6.70974V14.2969C1.5 15.0413 2.13136 15.6442 2.91085 15.6442H6.42917L8.48019 17.7815C8.75971 18.0728 9.24028 18.0728 9.51981 17.7815L11.5708 15.6442H15.0891C15.8686 15.6442 16.5 15.0413 16.5 14.2969L16.4991 6.70974C16.4991 5.96618 15.8679 5.3624 15.0884 5.3624ZM11.8116 11.1997C11.2314 12.1555 10.1539 12.75 8.99963 12.75C7.84539 12.75 6.76784 12.1563 6.18763 11.1997C5.99188 10.8781 6.10739 10.4663 6.44423 10.2785C6.78107 10.0924 7.21225 10.2019 7.40889 10.5235C7.74221 11.0734 8.33741 11.4018 9.00051 11.4018C9.66361 11.4018 10.2579 11.0734 10.5921 10.5235C10.7879 10.2019 11.2208 10.0932 11.5568 10.2785C11.8927 10.4663 12.0065 10.8781 11.8116 11.1997Z" fill="black"/>
                      </g>
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Co-Founder</h1>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m14.06 9.02.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg" disabled>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4v5c0 1.12.37 2.16 1 3H9c.65-.86 1-1.9 1-3V4zm3-2H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3V4h1c.55 0 1-.45 1-1s-.45-1-1-1" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Start new chat" onClick={handleNewChat}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm0 6-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25zm-7.5-5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12zm-1.51 3.49L9 15.17l-.99-2.18L5.83 12l2.18-.99L9 8.83l.99 2.18 2.18.99z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Content - Chat Area */}
                <div className="lg:col-span-7">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col" style={{height: 'calc(100vh - 200px)'}}>
                    {/* Chat Messages Area */}
                    <div className="flex-1 overflow-y-auto p-8">
                      {chatMessages.length === 0 ? (
                        <>
                          {/* Welcome Message */}
                          <div className="mb-8">
                            <p className="text-lg font-semibold text-gray-900 mb-3">Welcome! 👋 I'm your AI Co-Founder.</p>
                            <p className="text-gray-600 mb-6">I'm here to answer all of your business questions. To get the best responses, ask clear, complete questions.</p>
                            
                            <div className="mb-6">
                              <p className="text-sm font-semibold text-gray-900 mb-3">Examples:</p>
                              <ul className="space-y-2">
                                <li className="text-gray-600 text-sm">"What should I do to advertise my business?"</li>
                                <li className="text-gray-600 text-sm">"What documents do I need to file my Annual Report?"</li>
                                <li className="text-gray-600 text-sm">"Can I open a US business bank account without an SSN?"</li>
                              </ul>
                            </div>

                            <div className="mb-6">
                              <p className="text-sm font-semibold text-gray-900 mb-2">Need human support?</p>
                              <p className="text-gray-600 text-sm">Start by asking your question below. If you need hands-on help, I can route it to our Human Support team for you.</p>
                            </div>

                            <p className="text-gray-600">Let's build your business 🚀</p>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Chat Messages */}
                          <div className="space-y-6">
                            {chatMessages.map((message, index) => (
                              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-[#003174] text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-4 py-3`}>
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {isTyping && (
                              <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                  <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="relative">
                        <textarea
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="How can I help you today?"
                          className="w-full px-4 py-3 pr-24 bg-gray-50 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                          rows={2}
                          maxLength={400}
                        />
                        <div className="absolute bottom-3 right-3 flex items-center space-x-3">
                          <span className="text-xs text-gray-400">{chatInput.length} / 400</span>
                          <button 
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim()}
                            className={`p-2 rounded-full ${chatInput.trim() ? 'bg-[#003174] text-white hover:bg-[#0052b4]' : 'bg-gray-200 text-gray-400'} transition-colors`}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar - Conversations */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6" style={{height: 'calc(100vh - 200px)'}}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Conversations</h3>
                    
                    {/* Current Active Conversation */}
                    {chatMessages.length > 0 && !currentConversationId && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Active</p>
                        <div className="bg-[#e7edfc] border-2 border-[#003174] rounded-lg p-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-[#003174] rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {chatMessages[0]?.content}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {chatMessages.length} message{chatMessages.length !== 1 ? 's' : ''} • Just now
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Past Conversations */}
                    {conversations.length > 0 && (
                      <div className="overflow-y-auto" style={{maxHeight: 'calc(100vh - 350px)'}}>
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Past Conversations</p>
                        <div className="space-y-2">
                          {conversations.map((conversation) => (
                            <div
                              key={conversation.id}
                              className={`group relative border rounded-lg p-3 cursor-pointer transition-all ${
                                currentConversationId === conversation.id
                                  ? 'bg-[#e7edfc] border-[#003174]'
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                              onClick={() => loadConversation(conversation.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  currentConversationId === conversation.id ? 'bg-[#003174]' : 'bg-gray-400'
                                }`}>
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {conversation.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {conversation.messages.length} messages • {new Date(conversation.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteConversation(conversation.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                                >
                                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Empty State */}
                    {conversations.length === 0 && chatMessages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full py-12">
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <p className="text-lg font-semibold text-gray-900 mb-2">No Conversations</p>
                          <p className="text-sm text-gray-500">Your past conversations will show up here.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services Content */}
          {activeTab === 'services' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe 
                  src="/dashboard/services"
                  className="w-full h-full border-0"
                  title="Services Management"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              </div>
            </div>
          )}

          {/* Plans & Pricing Content */}
          {activeTab === 'plans' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe 
                  src="/dashboard/services/plans"
                  className="w-full h-full border-0"
                  title="Plans & Pricing"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              </div>
            </div>
          )}

          {/* Company Types Content */}
          {activeTab === 'company-types' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe 
                  src="/dashboard/services/company-types"
                  className="w-full h-full border-0"
                  title="Company Types"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              </div>
            </div>
          )}

          {/* Users Content */}
          {activeTab === 'users' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe 
                  src="/dashboard/user-management"
                  className="w-full h-full border-0"
                  title="User Management"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              </div>
            </div>
          )}

          {/* Company Content */}
          {activeTab === 'company' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe 
                  src="/dashboard/company"
                  className="w-full h-full border-0"
                  title="Company Management"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              </div>
            </div>
          )}

          {/* Document Approval Content */}
          {activeTab === 'documents' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe 
                  src="/dashboard/documents"
                  className="w-full h-full border-0"
                  title="Document Approval"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              </div>
            </div>
          )}

          {/* Settings General Content */}
          {activeTab === 'settings-general' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe 
                  src="/dashboard/settings/general"
                  className="w-full h-full border-0"
                  title="General Settings"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              </div>
            </div>
          )}

          {/* Settings Finance Content */}
          {activeTab === 'settings-finance' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe 
                  src="/dashboard/settings/finance"
                  className="w-full h-full border-0"
                  title="Finance Settings"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              </div>
            </div>
          )}

          {/* Settings Personalization Content */}
          {activeTab === 'settings-personalization' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe 
                  src="/dashboard/settings/personalization"
                  className="w-full h-full border-0"
                  title="Personalization Settings"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              </div>
            </div>
          )}

          {/* Settings Notifications Content */}
          {activeTab === 'settings-notifications' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe 
                  src="/dashboard/settings/notifications"
                  className="w-full h-full border-0"
                  title="Notification Settings"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              </div>
            </div>
          )}

          {/* Settings Others Content */}
          {activeTab === 'settings-others' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe 
                  src="/dashboard/settings/others"
                  className="w-full h-full border-0"
                  title="Other Settings"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              </div>
            </div>
          )}

          {/* Dashboard Content - Only show when activeTab is 'dashboard' */}
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Hi, {user.name?.split(' ')[0] || 'there'} 👋
                </h1>
                <p className="text-gray-600">Welcome to your business dashboard</p>
              </div>

              {/* Tax Filing Promotion Card */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-sm font-medium mb-4">
                    ⏰ Tax Season Alert
                  </div>
                  <h2 className="text-3xl font-bold mb-3">
                    File your taxes with confidence
                  </h2>
                  <p className="text-indigo-100 mb-6 text-lg">
                    Get professional tax preparation and filing services. Our experts ensure you maximize deductions and stay compliant.
                  </p>
                  <div className="flex items-center space-x-4">
                    <button className="bg-[#c51111] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a00e0e] transition-all shadow-lg hover:shadow-xl">
                      Upgrade Now
                    </button>
                    <span className="text-indigo-100">Starting at $299/year</span>
                  </div>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-purple-700/30 to-transparent"></div>
              </div>

              {/* Mercury Banking Application Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {/* Mercury Logo */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Mercury Banking Application</h3>
                        <p className="text-gray-600 text-sm">Business banking built for startups</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Onboarding data submitted
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#e7edfc] rounded-xl p-6 mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-[#d0ddfa] rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#003174]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Application in Progress</h4>
                        <p className="text-gray-600 text-sm mb-4">
                          Your Mercury banking application is being reviewed. This typically takes 1-2 business days. We'll notify you once your account is approved.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            No monthly fees or minimums
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            FDIC insured up to $5 million
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Free domestic and international wire transfers
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button className="bg-[#003174] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0052b4] transition-colors">
                      Continue Application
                    </button>
                    <p className="text-xs text-gray-500 max-w-md">
                      Mercury is a financial technology company, not a bank. Banking services provided by Choice Financial Group and Evolve Bank & Trust®; Members FDIC.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bookkeeping Software Promotion */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex-1 mb-6 md:mb-0">
                      <div className="inline-block bg-[#c51111] text-white rounded-full px-4 py-1 text-sm font-semibold mb-4">
                        💰 Special Offer - Save $100
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Professional Bookkeeping Software
                      </h3>
                      <p className="text-gray-700 mb-4 text-lg">
                        Keep your finances organized with industry-leading bookkeeping software. Track expenses, generate reports, and stay tax-ready year-round.
                      </p>
                      <div className="flex items-baseline space-x-3 mb-6">
                        <span className="text-4xl font-bold text-green-600">$300</span>
                        <span className="text-xl text-gray-500 line-through">$400</span>
                        <span className="text-gray-600">/year</span>
                      </div>
                      <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl">
                        Get Started Now
                      </button>
                    </div>
                    <div className="hidden md:block w-48 h-48 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Action Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Documents Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-[#d0ddfa] rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-[#003174]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Documents</h3>
                  <p className="text-sm text-gray-600 mb-3">Access all your business documents</p>
                  <div className="flex items-center text-[#003174] text-sm font-medium group-hover:text-indigo-700">
                    View All
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Consultations Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Consultations</h3>
                  <p className="text-sm text-gray-600 mb-3">Book time with our experts</p>
                  <div className="flex items-center text-[#003174] text-sm font-medium group-hover:text-indigo-700">
                    Schedule Now
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Refer Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Refer & Earn</h3>
                  <p className="text-sm text-gray-600 mb-3">Get rewards for referrals</p>
                  <div className="flex items-center text-[#003174] text-sm font-medium group-hover:text-indigo-700">
                    Start Earning
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Feedback Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Feedback</h3>
                  <p className="text-sm text-gray-600 mb-3">Share your thoughts with us</p>
                  <div className="flex items-center text-[#003174] text-sm font-medium group-hover:text-indigo-700">
                    Give Feedback
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Company Content Component
function CompanyContent({ user }: { user: any }) {
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeInfoTab, setActiveInfoTab] = useState(0);

  // Parse ownership data from user if available
  let members = [];
  try {
    if (user?.ownershipData) {
      const ownershipData = typeof user.ownershipData === 'string' 
        ? JSON.parse(user.ownershipData) 
        : user.ownershipData;
      
      members = ownershipData.owners?.map((owner: any) => ({
        name: owner.fullName || owner.name,
        ownership: owner.ownership ? `${owner.ownership}%` : 'N/A',
        ssn: owner.ssn || 'N/A',
        address: owner.address || `${user.country || 'N/A'}`
      })) || [];
    }
  } catch (e) {
    console.error('Error parsing ownership data:', e);
  }

  // If no members found, use the logged-in user as the sole member
  if (members.length === 0) {
    members = [{
      name: user?.name || 'N/A',
      ownership: '100%',
      ssn: 'N/A',
      address: `${user?.country || 'N/A'}`
    }];
  }

  const company = {
    id: 1,
    companyName: user?.companyName || "Your Company",
    businessType: user?.businessType === 'llc' ? 'LLC' : user?.businessType === 'c-corp' ? 'C-Corp' : (user?.businessType || 'Not specified'),
    selectedState: user?.selectedState || "Not specified",
    industry: "Business Services",
    description: user?.companyName ? `${user.companyName} - Professional Business Services` : "Your business description",
    status: user?.onboardingComplete ? "active" : "pending",
    progress: {
      current: user?.onboardingComplete ? 4 : 2,
      total: 4,
      steps: [
        { name: "Order Processed", completed: true },
        { name: "Company and Member Profile", completed: !!user?.companyName },
        { name: "Formation Filed", completed: user?.onboardingComplete || false },
        { name: "Articles of Organization", completed: false, current: !user?.onboardingComplete }
      ]
    },
    responsibleParty: {
      name: user?.name || "N/A",
      ssn: "N/A",
      address: `${user?.country || 'N/A'}`
    },
    members: members,
    documents: { count: 0 }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['Company', 'EIN', 'Essentials'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveMainTab(index)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeMainTab === index
                    ? 'border-blue-600 text-[#003174]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {index === 0 && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
                {index === 1 && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {index === 2 && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Progress Section */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Progress Steps */}
            <div className="md:col-span-4">
              <div className="mb-4">
                <div className="bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-[#003174] h-2 rounded-full"
                    style={{ width: `${(company.progress.current / company.progress.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Step {company.progress.current}/{company.progress.total}
                </p>
              </div>

              <div className="space-y-4">
                {company.progress.steps.map((step: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg
                      className={`w-6 h-6 flex-shrink-0 ${
                        step.completed ? 'text-green-500' : step.current ? 'text-gray-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                    </svg>
                    <p className={`text-sm ${step.completed || step.current ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {step.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Status Card */}
            <div className="md:col-span-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                  </svg>
                  <span className="text-green-700 font-semibold">Completed</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Articles of Organization</h3>
                <p className="text-gray-700 mb-4">
                  Time to celebrate! The Articles of Organization document for {company.companyName} was received
                  and uploaded to your customer dashboard. Your business is now officially formed in {company.selectedState}.
                  Now that your business is formed, we will start the process to get your businesses EIN number registered with the IRS.
                </p>
                <button className="bg-[#003174] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  Check Documents
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['Information', 'Compliance'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveInfoTab(index)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeInfoTab === index
                    ? 'border-blue-600 text-[#003174]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {index === 0 && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
                {index === 1 && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Information Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Associated Customer */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Associated Customer</h3>
                <div className="space-y-4">
                  <InfoRow label="Full Name" value={user?.name || 'N/A'} onCopy={() => copyToClipboard(user?.name)} />
                  <InfoRow label="Email" value={user?.email || 'N/A'} onCopy={() => copyToClipboard(user?.email)} />
                </div>
              </div>

              {/* Company */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Company</h3>
                <div className="space-y-4">
                  <InfoRow label="Name" value={company.companyName} onCopy={() => copyToClipboard(company.companyName)} />
                  <InfoRow label="Entity" value={company.businessType} onCopy={() => copyToClipboard(company.businessType)} />
                  <InfoRow label="State" value={company.selectedState} onCopy={() => copyToClipboard(company.selectedState)} />
                  <InfoRow label="Industry" value={company.industry} onCopy={() => copyToClipboard(company.industry)} />
                  <InfoRow label="Description" value={company.description} onCopy={() => copyToClipboard(company.description)} />
                </div>
              </div>

              {/* Responsible Party */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-md font-bold text-gray-900 mb-4">Responsible Party</h4>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <p className="font-semibold text-gray-900">{company.responsibleParty.name}</p>
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">SSN 🇺🇸</span>
                      <span className="text-gray-900">{company.responsibleParty.ssn}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Address</span>
                      <span className="text-gray-900 text-right max-w-xs">{company.responsibleParty.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Members */}
              <div>
                <h4 className="text-md font-bold text-gray-900 mb-4">All Members</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {company.members.map((member: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold text-gray-900 mb-3">{member.name}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Ownership</span>
                          <span className="text-gray-900">{member.ownership}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">SSN 🇺🇸</span>
                          <span className="text-gray-900">{member.ssn}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500 block mb-1">Address</span>
                          <span className="text-gray-900 text-xs">{member.address}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Documents Sidebar */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Company documents</p>
                    <p className="text-sm text-gray-500">{company.documents.count} documents</p>
                  </div>
                  <button className="w-full bg-[#003174] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    My documents
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function InfoRow({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <div className="col-span-2 flex items-center justify-between">
        <p className="text-sm text-gray-900">{value}</p>
        <button
          onClick={onCopy}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
