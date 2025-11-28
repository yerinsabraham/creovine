import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaCode, FaLink, FaImage, FaCopy, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import logo from '../assets/logo.png';

const ExpertChatPage = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const expertInfo = {
    'support-expert': { name: 'General Support', specialty: 'Platform Support & Guidance', color: '#29BD98' },
    'frontend-specialist': { name: 'Sarah', specialty: 'Frontend Engineering', color: '#2497F9' },
    'backend-architect': { name: 'Michael', specialty: 'Backend Architecture', color: '#8B5CF6' },
    'mobile-developer': { name: 'Aisha', specialty: 'Mobile App Development', color: '#F59E0B' },
    'ui-ux-designer': { name: 'James', specialty: 'UI/UX Design', color: '#EF4444' },
    'product-strategist': { name: 'Emily', specialty: 'Product Strategy', color: '#10B981' },
    'marketing-specialist': { name: 'David', specialty: 'Growth Marketing', color: '#6366F1' }
  };

  const expert = expertInfo[expertId] || expertInfo['support-expert'];
  const isSupportExpert = expertId === 'support-expert';

  // Redirect to experts page if not logged in (except for support expert)
  useEffect(() => {
    if (!currentUser && !isSupportExpert) {
      navigate('/experts');
    }
  }, [currentUser, navigate, isSupportExpert]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages from Firestore
  useEffect(() => {
    if (!currentUser && !isSupportExpert) return;

    // For support expert without login, use a temporary session ID
    const userId = currentUser?.uid || `guest_${Date.now()}`;
    const conversationId = `${userId}_${expertId}`;
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [currentUser, expertId, isSupportExpert]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputMessage]);

  const detectMessageType = (text) => {
    // Detect code blocks (triple backticks)
    if (text.includes('```')) {
      return 'code-block';
    }
    // Detect inline code (single backticks)
    if (text.includes('`') && text.split('`').length > 2) {
      return 'code-inline';
    }
    // Detect URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(text)) {
      return 'link';
    }
    // Detect common file extensions
    const fileExtRegex = /\.(jsx?|tsx?|py|java|cpp|cs|php|rb|go|rs|dart|swift|kt|md|json|xml|yaml|yml|css|scss|html)(\s|$)/i;
    if (fileExtRegex.test(text)) {
      return 'file';
    }
    return 'text';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || sending) return;
    
    // For support expert, allow guest messages but prompt login
    if (!currentUser && isSupportExpert) {
      alert('Please sign in to send messages. Click the "Sign In" button at the top.');
      return;
    }
    
    if (!currentUser) return;

    setSending(true);
    const messageText = inputMessage.trim();
    const messageType = detectMessageType(messageText);

    try {
      const conversationId = `${currentUser.uid}_${expertId}`;
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');

      await addDoc(messagesRef, {
        text: messageText,
        type: messageType,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        senderType: 'user',
        timestamp: serverTimestamp(),
        read: false
      });

      // Also update conversation metadata
      const conversationsRef = collection(db, 'conversations');
      await addDoc(conversationsRef, {
        id: conversationId,
        userId: currentUser.uid,
        expertId: expertId,
        expertName: expert.name,
        lastMessage: messageText.substring(0, 100),
        lastMessageTime: serverTimestamp(),
        unreadCount: 0
      });

      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#15293A', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(21, 41, 58, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMobile ? '12px 16px' : '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/experts')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = expert.color}
              onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
            >
              <FaArrowLeft />
            </button>
            <div style={{
              width: isMobile ? '40px' : '48px',
              height: isMobile ? '40px' : '48px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${expert.color}30, ${expert.color}10)`,
              border: `2px solid ${expert.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '16px' : '20px',
              fontWeight: '700',
              color: expert.color
            }}>
              {expert.name[0]}
            </div>
            <div>
              <h2 style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '700',
                color: '#FFFFFF',
                margin: 0
              }}>
                {expert.name}
              </h2>
              <p style={{
                fontSize: isMobile ? '12px' : '13px',
                color: 'rgba(255, 255, 255, 0.6)',
                margin: 0
              }}>
                {isMobile ? 'Online' : `${expert.specialty} • Online`}
              </p>
            </div>
          </div>
          <img 
            src={logo} 
            alt="Creovine" 
            style={{ height: '28px', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
        </div>
      </header>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '16px 12px' : '24px',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto'
      }}>
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>💬</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Start Your Conversation
            </h3>
            <p style={{ fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              Send your first message to {expert.name}. You can share code, links, files, and more!
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                isMobile={isMobile} 
                expert={expert}
                isOwn={message.senderId === currentUser?.uid}
                index={index}
              />
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        backgroundColor: '#214055',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMobile ? '12px 16px' : '20px 24px',
        position: 'sticky',
        bottom: 0
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <div style={{
            flex: 1,
            backgroundColor: '#15293A',
            borderRadius: '16px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <textarea
              ref={textareaRef}
              id="chat-message-input"
              name="message"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Use ``` for code blocks, ` for inline code)"
              aria-label="Chat message input"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '16px',
                resize: 'none',
                minHeight: '24px',
                maxHeight: '200px',
                fontFamily: 'inherit'
              }}
              rows={1}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || sending}
            style={{
              background: inputMessage.trim() 
                ? `linear-gradient(135deg, ${expert.color}, ${expert.color}cc)` 
                : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '12px',
              padding: isMobile ? '12px 16px' : '14px 20px',
              color: '#FFFFFF',
              fontSize: isMobile ? '16px' : '18px',
              cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: isMobile ? '44px' : '52px'
            }}
            onMouseEnter={(e) => {
              if (inputMessage.trim()) {
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            <FaPaperPlane />
          </button>
        </div>
        <p style={{
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.4)',
          textAlign: 'center',
          marginTop: '8px',
          marginBottom: 0
        }}>
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

// Message Bubble Component with smart rendering
const MessageBubble = ({ message, expert, isOwn, index, isMobile }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderMessageContent = () => {
    const text = message.text;

    // Render code blocks (triple backticks)
    if (message.type === 'code-block' || text.includes('```')) {
      const parts = text.split('```');
      return (
        <div>
          {parts.map((part, i) => {
            if (i % 2 === 1) {
              // This is code
              const lines = part.split('\n');
              const language = lines[0].trim();
              const code = lines.slice(1).join('\n');
              
              return (
                <div 
                  key={i}
                  style={{
                    backgroundColor: '#0F1F2E',
                    borderRadius: '12px',
                    padding: '16px',
                    marginTop: i > 0 ? '12px' : 0,
                    marginBottom: i < parts.length - 1 ? '12px' : 0,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: expert.color,
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      <FaCode style={{ marginRight: '6px' }} />
                      {language || 'code'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(code)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      {copied ? <FaCheck /> : <FaCopy />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#FFFFFF',
                    fontFamily: 'monospace',
                    lineHeight: '1.6',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {code}
                  </pre>
                </div>
              );
            } else if (part.trim()) {
              // Regular text
              return <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</div>;
            }
            return null;
          })}
        </div>
      );
    }

    // Render inline code (single backticks)
    if (message.type === 'code-inline' || text.includes('`')) {
      const parts = text.split('`');
      return (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {parts.map((part, i) => {
            if (i % 2 === 1) {
              return (
                <code 
                  key={i}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    color: expert.color
                  }}
                >
                  {part}
                </code>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </div>
      );
    }

    // Render links
    if (message.type === 'link') {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = text.split(urlRegex);
      return (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {parts.map((part, i) => {
            if (part.match(urlRegex)) {
              return (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: expert.color,
                    textDecoration: 'underline',
                    fontWeight: '600'
                  }}
                >
                  <FaLink style={{ marginRight: '4px', fontSize: '12px' }} />
                  {part}
                </a>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </div>
      );
    }

    // Regular text
    return <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{text}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        marginBottom: '16px'
      }}
    >
      <div style={{
        maxWidth: isMobile ? '85%' : '70%',
        backgroundColor: isOwn ? expert.color : '#214055',
        color: '#FFFFFF',
        padding: isMobile ? '10px 14px' : '12px 16px',
        borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        fontSize: isMobile ? '14px' : '15px'
      }}>
        {!isOwn && (
          <p style={{
            fontSize: '12px',
            fontWeight: '600',
            color: expert.color,
            marginBottom: '8px',
            margin: 0
          }}>
            {message.senderName}
          </p>
        )}
        {renderMessageContent()}
        <p style={{
          fontSize: '11px',
          color: isOwn ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.5)',
          marginTop: '8px',
          marginBottom: 0,
          textAlign: 'right'
        }}>
          {message.timestamp?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Sending...'}
        </p>
      </div>
    </motion.div>
  );
};

export default ExpertChatPage;
