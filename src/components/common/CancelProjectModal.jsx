import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CancelProjectModal = ({ isOpen, onClose, project, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const cancellationReasons = [
    { id: 'budget', label: '💰 Budget constraints', emoji: '💰' },
    { id: 'timeline', label: '⏱️ Timeline doesn\'t work for me', emoji: '⏱️' },
    { id: 'requirements-changed', label: '🔄 Project requirements changed', emoji: '🔄' },
    { id: 'communication', label: '👎 Not satisfied with communication', emoji: '👎' },
    { id: 'no-longer-needed', label: '🚫 No longer need this project', emoji: '🚫' },
    { id: 'other', label: '💡 Other (please specify below)', emoji: '💡' }
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert('Please select a reason for cancellation');
      return;
    }

    // If "Other" is selected, require additional details
    if (selectedReason === 'other' && !additionalDetails.trim()) {
      alert('Please provide details about your cancellation reason');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        reason: selectedReason,
        reasonLabel: cancellationReasons.find(r => r.id === selectedReason)?.label,
        additionalDetails: additionalDetails.trim(),
        requestedAt: new Date().toISOString()
      });
      
      // Reset form
      setSelectedReason('');
      setAdditionalDetails('');
      onClose();
    } catch (error) {
      console.error('Error submitting cancellation:', error);
      alert('Failed to submit cancellation request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setSelectedReason('');
      setAdditionalDetails('');
      onClose();
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
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#15293A',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                fontSize: '32px'
              }}>⚠️</div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
                margin: 0
              }}>
                Request Project Cancellation
              </h2>
            </div>
            <button
              onClick={handleClose}
              disabled={submitting}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '24px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                padding: '4px',
                opacity: submitting ? 0.5 : 1
              }}
            >
              ✕
            </button>
          </div>

          {/* Project Info */}
          <div style={{
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: '0 0 8px 0'
            }}>
              You are requesting to cancel:
            </p>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#FFFFFF',
              margin: 0
            }}>
              {project?.phases?.vision?.projectName || 
               project?.phases?.identity?.projectName || 
               'Your Project'}
            </p>
          </div>

          {/* Reason Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#FFFFFF',
              marginBottom: '16px'
            }}>
              Why do you want to cancel? <span style={{ color: '#E74C3C' }}>*</span>
            </label>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {cancellationReasons.map((reason) => (
                <motion.label
                  key={reason.id}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: selectedReason === reason.id 
                      ? 'rgba(231, 76, 60, 0.15)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: selectedReason === reason.id
                      ? '2px solid #E74C3C'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: submitting ? 0.6 : 1
                  }}
                >
                  <input
                    type="radio"
                    name="cancellation-reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    disabled={submitting}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      accentColor: '#E74C3C'
                    }}
                  />
                  <span style={{
                    fontSize: '16px',
                    color: '#FFFFFF',
                    fontWeight: selectedReason === reason.id ? '600' : '400'
                  }}>
                    {reason.label}
                  </span>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Additional details {selectedReason === 'other' && <span style={{ color: '#E74C3C' }}>*</span>}
              <span style={{
                fontSize: '14px',
                fontWeight: '400',
                color: 'rgba(255, 255, 255, 0.5)',
                marginLeft: '8px'
              }}>
                (Optional)
              </span>
            </label>
            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              disabled={submitting}
              placeholder="Please provide any additional information that would help us understand your decision..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '15px',
                fontFamily: 'inherit',
                resize: 'vertical',
                opacity: submitting ? 0.6 : 1,
                cursor: submitting ? 'not-allowed' : 'text'
              }}
            />
          </div>

          {/* Info Box */}
          <div style={{
            backgroundColor: 'rgba(41, 189, 152, 0.1)',
            border: '1px solid rgba(41, 189, 152, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              lineHeight: '1.6'
            }}>
              ℹ️ Your cancellation request will be reviewed by our team. We'll contact you within 24 hours to discuss next steps and process any applicable refunds.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <motion.button
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              onClick={handleClose}
              disabled={submitting}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.5 : 1
              }}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              onClick={handleSubmit}
              disabled={submitting || !selectedReason}
              style={{
                backgroundColor: submitting || !selectedReason ? '#7A3C37' : '#E74C3C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: submitting || !selectedReason ? 'not-allowed' : 'pointer',
                opacity: submitting || !selectedReason ? 0.6 : 1
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Cancellation Request'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CancelProjectModal;
