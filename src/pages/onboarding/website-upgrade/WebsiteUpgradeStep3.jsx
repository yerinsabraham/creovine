import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useAuth } from '../../../context/AuthContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import OnboardingLayout from '../../../components/common/OnboardingLayout';
import TimelineSelector from '../../../components/common/TimelineSelector';
import AssistedToggle from '../../../components/common/AssistedToggle';
import { useCart } from '../../../context/CartContext';
import CartSummary from '../../../components/common/CartSummary';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import confetti from 'canvas-confetti';

const WebsiteUpgradeStep3 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#8B5CF6';
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    timeline: projectData?.websiteUpgrade?.timeline || '4-6',
    budget: projectData?.websiteUpgrade?.budget || '',
    specialRequirements: projectData?.websiteUpgrade?.specialRequirements || ''
  });

  const [needsConsultation, setNeedsConsultation] = useState(
    items.some(item => item.id === 'website-upgrade-consultation-final')
  );

  const budgetOptions = [
    { id: 'under-1k', label: 'Under $1,000' },
    { id: '1k-3k', label: '$1,000 - $3,000' },
    { id: '3k-5k', label: '$3,000 - $5,000' },
    { id: '5k-10k', label: '$5,000 - $10,000' },
    { id: 'over-10k', label: 'Over $10,000' },
    { id: 'flexible', label: 'Flexible / To be discussed' }
  ];

  // Toggle consultation
  useEffect(() => {
    const itemId = 'website-upgrade-consultation-final';
    const itemExists = items.some(item => item.id === itemId);

    if (needsConsultation && !itemExists) {
      addItem({
        id: itemId,
        name: 'Project Consultation',
        price: 250,
        description: 'Detailed consultation and project planning session',
        category: 'assistance'
      });
    } else if (!needsConsultation && itemExists) {
      removeItem(itemId);
    }
  }, [needsConsultation, items, addItem, removeItem]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const triggerConfetti = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      alert('Please sign in to submit your project');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Update project data with final step
      const finalProjectData = {
        ...projectData,
        websiteUpgrade: {
          ...projectData?.websiteUpgrade,
          ...formData
        },
        serviceType: 'website-upgrade',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        cartItems: items
      };

      await updateProjectData(finalProjectData);

      // Save to Firestore
      const projectId = `project_${currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, 'projects', projectId), {
        ...finalProjectData,
        projectId,
        createdAt: new Date().toISOString()
      });

      // Trigger confetti
      triggerConfetti();

      // Navigate to success page
      setTimeout(() => {
        navigate('/project-submitted', { 
          state: { 
            serviceType: 'website-upgrade',
            serviceName: 'Website Update/Upgrade'
          } 
        });
      }, 1000);

    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Failed to submit project. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isValid = formData.timeline && formData.budget;

  return (
    <OnboardingLayout
      currentUser={currentUser}
      onLogout={handleLogout}
      isMobile={isMobile}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px', textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '800',
            background: `linear-gradient(135deg, ${themeColor}, ${themeColor}CC)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Timeline & Budget
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            When do you need this done, and what's your budget range?
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            backgroundColor: '#1A2332',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '24px'
          }}
        >
          {/* Timeline Selector */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '16px'
            }}>
              Project Timeline *
            </label>
            <TimelineSelector
              value={formData.timeline}
              onChange={(value) => handleInputChange('timeline', value)}
              themeColor={themeColor}
            />
          </div>

          {/* Budget Range */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF' }}>
                Budget Range *
              </label>
              <AssistedToggle
                enabled={needsConsultation}
                onToggle={setNeedsConsultation}
                price={250}
                label="Need consultation?"
              />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '12px',
              marginTop: '12px'
            }}>
              {budgetOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleInputChange('budget', option.id)}
                  style={{
                    padding: '16px',
                    backgroundColor: formData.budget === option.id 
                      ? `${themeColor}22` 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: formData.budget === option.id
                      ? `2px solid ${themeColor}`
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: formData.budget === option.id ? themeColor : '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: formData.budget === option.id ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: '12px'
            }}>
              This helps us provide an accurate quote for your upgrade
            </p>
          </div>

          {/* Special Requirements */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Special Requirements (Optional)
            </label>
            <textarea
              id="special-requirements"
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
              placeholder="Any specific hosting requirements, compliance needs, or other considerations..."
              rows={5}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = themeColor}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>

          {/* Summary Info */}
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: themeColor, marginBottom: '12px' }}>
              Ready to Submit
            </h3>
            <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '8px' }}>
                ✓ Website: {projectData?.websiteUpgrade?.websiteName}
              </p>
              <p style={{ marginBottom: '8px' }}>
                ✓ Features: {projectData?.websiteUpgrade?.features?.length || 0} selected
              </p>
              <p style={{ marginBottom: '8px' }}>
                ✓ Timeline: {formData.timeline} weeks
              </p>
              {items.length > 0 && (
                <p>
                  ✓ Add-ons: {items.length} assistance item{items.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Cart Summary */}
        <CartSummary isMobile={isMobile} />

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '32px'
          }}
        >
          <button
            onClick={() => navigate('/onboarding/website-upgrade/step2')}
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isSubmitting ? 0.5 : 1
            }}
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            style={{
              flex: 2,
              padding: '16px',
              background: (isValid && !isSubmitting)
                ? `linear-gradient(135deg, ${themeColor}, ${themeColor}CC)` 
                : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '12px',
              color: (isValid && !isSubmitting) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
              fontSize: '16px',
              fontWeight: '700',
              cursor: (isValid && !isSubmitting) ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Project 🚀'}
          </button>
        </motion.div>
      </div>
    </OnboardingLayout>
  );
};

export default WebsiteUpgradeStep3;
