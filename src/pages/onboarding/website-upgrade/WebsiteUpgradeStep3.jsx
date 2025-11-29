import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../../context/AuthContext';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import { db } from '../../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';
import TimelineSelector from '../../../components/common/TimelineSelector';
import logo from '../../../assets/logo.png';

const WebsiteUpgradeStep3 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updateProjectData } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();
  
  const themeColor = '#8B5CF6';
  
  const [formData, setFormData] = useState({
    timeline: projectData?.websiteUpgrade?.timeline || { amount: 7, unit: 'days' },
    budget: projectData?.websiteUpgrade?.budget || '',
    specialRequirements: projectData?.websiteUpgrade?.specialRequirements || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTimelineChange = (timeline) => {
    setFormData(prev => ({ ...prev, timeline }));
  };

  const handleBudgetChange = (budget) => {
    setFormData(prev => ({ ...prev, budget }));
  };

  const handleTextareaChange = (value) => {
    setFormData(prev => ({ ...prev, specialRequirements: value }));
  };

  const handleBack = async () => {
    await updateProjectData({ 
      websiteUpgrade: {
        ...projectData?.websiteUpgrade,
        ...formData
      }
    });
    navigate('/onboarding/website-upgrade/step2');
  };

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Update project data
      await updateProjectData({ 
        websiteUpgrade: {
          ...projectData?.websiteUpgrade,
          ...formData
        }
      });

      // Save to Firestore
      const projectRef = collection(db, 'projects');
      await addDoc(projectRef, {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        serviceType: 'website-upgrade',
        serviceName: 'Website Update/Upgrade',
        projectData: {
          ...projectData?.websiteUpgrade,
          ...formData
        },
        cartItems: items || [],
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Navigate to success page
      setTimeout(() => {
        navigate('/project-submitted', {
          state: {
            serviceType: 'website-upgrade',
            serviceName: 'Website Update/Upgrade'
          }
        });
      }, 500);

    } catch (error) {
      console.error('Error submitting project:', error);
      alert('There was an error submitting your project. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isValid = formData.timeline && formData.budget;

  const budgetOptions = [
    'Under $1,000',
    '$1,000-$3,000',
    '$3,000-$5,000',
    '$5,000-$10,000',
    'Over $10,000',
    'Flexible/To be discussed'
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#15293A' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(21, 41, 58, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMobile ? '16px 20px' : '20px 40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? '12px' : '0'
        }}>
          <img 
            src={logo} 
            alt="Creovine" 
            style={{
              height: isMobile ? '28px' : '32px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          />
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? '12px' : '24px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            flex: 1
          }}>
            {!isMobile && currentUser && (
              <div style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                {currentUser.email}
              </div>
            )}
            <button
              onClick={handleLogout}
              style={{
                padding: isMobile ? '8px 16px' : '10px 20px',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '600',
                color: '#FFFFFF',
                backgroundColor: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '24px 20px' : '32px 40px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          {[1, 2, 3].map(step => (
            <div
              key={step}
              style={{
                flex: 1,
                height: '8px',
                backgroundColor: themeColor,
                borderRadius: '4px',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
        <div style={{
          fontSize: isMobile ? '12px' : '14px',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'right'
        }}>
          Step 3 of 3
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: isMobile ? '0 20px 120px' : '0 40px 120px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Timeline & Budget
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Let's finalize your project timeline and budget expectations
            </p>
          </div>

          {/* Form */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            marginBottom: '32px'
          }}>
            {/* Timeline */}
            <div style={{ marginBottom: '32px' }}>
              <TimelineSelector
                value={formData.timeline}
                onChange={handleTimelineChange}
                serviceComplexity="medium"
                showPriceImpact={true}
              />
            </div>

            {/* Consultation Toggle */}
            <AssistedToggle
              id="website-upgrade-consultation"
              category="Website Upgrade"
              label="Want help planning your budget and timeline?"
              price={250}
              assistedLabel="Schedule consultation"
              tooltipText="Get expert guidance on budget allocation and realistic timelines for your website upgrade project."
            />

            {/* Budget Range */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                What's your budget range? *
              </label>
              <p style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '16px'
              }}>
                This helps us tailor our recommendations to your investment level
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                {budgetOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleBudgetChange(option)}
                    style={{
                      padding: '16px',
                      backgroundColor: formData.budget === option 
                        ? `${themeColor}22` 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.budget === option
                        ? `2px solid ${themeColor}`
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: formData.budget === option ? themeColor : '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: formData.budget === option ? '700' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Requirements */}
            <div style={{ marginBottom: '0' }}>
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
                onChange={(e) => handleTextareaChange(e.target.value)}
                placeholder="Any specific technical requirements, compliance needs, or special considerations? (e.g., GDPR compliance, specific hosting requirements, third-party integrations...)"
                rows={6}
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
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = themeColor}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>
          </div>

          {/* Cart Summary */}
          <CartSummary />

          {/* Navigation */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '32px'
          }}>
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: '18px',
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
              onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
              onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = 'transparent')}
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              style={{
                flex: 2,
                padding: '18px',
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
              {isSubmitting ? 'Submitting...' : 'Submit Project 🎉'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WebsiteUpgradeStep3;
