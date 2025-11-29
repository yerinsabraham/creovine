import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const MessagesPanel = ({ userId, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (userId && isOpen) {
      fetchMessages();
    }
  }, [userId, isOpen]);

  const fetchMessages = async () => {
    try {
      const q = query(
        collection(db, 'user_messages'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedMessages = [];
      querySnapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await updateDoc(doc(db, 'user_messages', messageId), {
        read: true,
        readAt: new Date()
      });
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'payment': return '💰';
      case 'info-request': return '📋';
      case 'progress': return '✅';
      case 'completion': return '🚀';
      case 'alert': return '⚠️';
      default: return '📩';
    }
  };

  const getMessageColor = (type) => {
    switch (type) {
      case 'payment': return '#29BD98';
      case 'info-request': return '#2497F9';
      case 'progress': return '#9B59B6';
      case 'completion': return '#27AE60';
      case 'alert': return '#E74C3C';
      default: return '#FFFFFF';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#15293A',
            borderRadius: '20px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ fontSize: '28px' }}>📬</div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
                margin: 0
              }}>
                Messages
              </h2>
              {messages.filter(m => !m.read).length > 0 && (
                <span style={{
                  backgroundColor: '#E74C3C',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '4px 12px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {messages.filter(m => !m.read).length} new
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div style={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden'
          }}>
            {/* Message List */}
            <div style={{
              width: selectedMessage ? '40%' : '100%',
              borderRight: selectedMessage ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              overflowY: 'auto',
              padding: '16px'
            }}>
              {loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '16px'
                  }}>
                    No messages yet
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleMessageClick(message)}
                    style={{
                      backgroundColor: selectedMessage?.id === message.id 
                        ? 'rgba(41, 189, 152, 0.1)' 
                        : message.read 
                          ? 'rgba(255, 255, 255, 0.03)' 
                          : 'rgba(41, 189, 152, 0.05)',
                      border: selectedMessage?.id === message.id
                        ? '2px solid #29BD98'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    {!message.read && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#E74C3C',
                        borderRadius: '50%'
                      }} />
                    )}
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '24px' }}>
                        {getMessageIcon(message.type)}
                      </span>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#FFFFFF',
                          margin: '0 0 4px 0'
                        }}>
                          {message.subject}
                        </h4>
                        <p style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          margin: 0
                        }}>
                          {message.createdAt?.toDate?.().toLocaleDateString() || 'Recent'}
                        </p>
                      </div>
                    </div>
                    
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {message.preview || message.message}
                    </p>
                  </motion.div>
                ))
              )}
            </div>

            {/* Message Detail */}
            {selectedMessage && (
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 32px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  <span style={{ fontSize: '32px' }}>
                    {getMessageIcon(selectedMessage.type)}
                  </span>
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      margin: '0 0 4px 0'
                    }}>
                      {selectedMessage.subject}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      margin: 0
                    }}>
                      {selectedMessage.createdAt?.toDate?.().toLocaleString() || 'Recently'}
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px',
                  borderLeft: `4px solid ${getMessageColor(selectedMessage.type)}`
                }}>
                  <p style={{
                    fontSize: '15px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.7',
                    margin: 0,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Payment Link Button (if it's a payment message) */}
                {selectedMessage.type === 'payment' && selectedMessage.paymentLink && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(selectedMessage.paymentLink, '_blank')}
                    style={{
                      backgroundColor: '#29BD98',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    💳 Make Payment
                  </motion.button>
                )}

                {/* Action Link (for other types) */}
                {selectedMessage.actionLink && selectedMessage.type !== 'payment' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(selectedMessage.actionLink, '_blank')}
                    style={{
                      backgroundColor: 'rgba(41, 189, 152, 0.1)',
                      color: '#29BD98',
                      border: '1px solid rgba(41, 189, 152, 0.3)',
                      borderRadius: '12px',
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    {selectedMessage.actionLabel || 'View Details'}
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MessagesPanel;
