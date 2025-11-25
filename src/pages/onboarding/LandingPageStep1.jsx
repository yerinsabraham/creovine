import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGlobe, FaArrowRight, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import logo from '../../assets/logo.png';

const LandingPageStep1 = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateProjectData } = useProject();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/get-started');
    }
  }, [currentUser, navigate]);

  const [formData, setFormData] = useState({
    projectName: '',
    purpose: '',
    targetAudience: '',
    callToAction: ''
  });

  const [errors, setErrors] = useState({});

  const purposeOptions = [
    { id: 'launch', label: 'Product Launch', icon: '🚀', desc: 'Announce a new product or service' },
    { id: 'waitlist', label: 'Waitlist/Coming Soon', icon: '⏰', desc: 'Build anticipation and collect emails' },
    { id: 'sales', label: 'Sales/Lead Gen', icon: '💰', desc: 'Convert visitors into customers' },
    { id: 'portfolio', label: 'Portfolio/Showcase', icon: '🎨', desc: 'Display your work or services' },
    { id: 'event', label: 'Event', icon: '🎉', desc: 'Promote an event or conference' },
    { id: 'other', label: 'Other', icon: '✨', desc: 'Custom landing page' }
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!formData.purpose) newErrors.purpose = 'Please select a purpose';
    if (!formData.targetAudience.trim()) newErrors.targetAudience = 'Target audience is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      updateProjectData({
        serviceCategory: 'landing-page',
        serviceName: 'Landing Page',
        landingPage: {
          ...formData
        }
      });
      // TODO: Navigate to next step when created
      alert('Landing page flow coming soon! For now, use the full app builder.');
      navigate('/onboarding/phase1');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #15293A 0%, #0F1F2E 100%)',
      padding: isMobile ? '20px' : '40px'
    }}>
      {/* Header */}
      <header style={{
        maxWidth: '1200px',
        margin: '0 auto 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <img 
          src={logo} 
          alt="Creovine" 
          style={{ height: isMobile ? '28px' : '36px', cursor: 'pointer' }}
          onClick={() => navigate('/get-started')}
        />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 20px',
          backgroundColor: 'rgba(41, 189, 152, 0.1)',
          borderRadius: '50px',
          border: '1px solid rgba(41, 189, 152, 0.3)'
        }}>
          <FaGlobe style={{ color: '#29BD98' }} />
          <span style={{
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: '700',
            color: '#29BD98'
          }}>
            Landing Page
          </span>
        </div>
      </header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: '#214055',
          borderRadius: '24px',
          padding: isMobile ? '32px 24px' : '48px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Step Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #29BD98, #2497F9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '700',
            color: '#FFFFFF'
          }}>
            1
          </div>
          <div>
            <div style={{
              fontSize: isMobile ? '12px' : '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '4px'
            }}>
              Step 1 of 4
            </div>
            <div style={{
              fontSize: isMobile ? '18px' : '24px',
              fontWeight: '700',
              color: '#FFFFFF'
            }}>
              Tell us about your landing page
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '12px'
          }}>
            Project/Product Name
          </label>
          <input
            type="text"
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            placeholder="e.g., TaskFlow, FitnessPro, CryptoWallet"
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#15293A',
              border: `2px solid ${errors.projectName ? '#EF4444' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#29BD98'}
            onBlur={(e) => !errors.projectName && (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
          />
          {errors.projectName && (
            <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '8px' }}>
              {errors.projectName}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '12px'
          }}>
            What's the main purpose of this landing page?
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {purposeOptions.map(option => (
              <motion.div
                key={option.id}
                onClick={() => setFormData({ ...formData, purpose: option.id })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '16px',
                  backgroundColor: formData.purpose === option.id ? 'rgba(41, 189, 152, 0.2)' : '#15293A',
                  border: `2px solid ${formData.purpose === option.id ? '#29BD98' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '24px' }}>{option.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    marginBottom: '4px'
                  }}>
                    {option.label}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.4'
                  }}>
                    {option.desc}
                  </div>
                </div>
                {formData.purpose === option.id && (
                  <FaCheckCircle style={{ color: '#29BD98', fontSize: '20px' }} />
                )}
              </motion.div>
            ))}
          </div>
          {errors.purpose && (
            <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '8px' }}>
              {errors.purpose}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '12px'
          }}>
            Who is your target audience?
          </label>
          <textarea
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            placeholder="e.g., Fitness enthusiasts, tech startups, crypto traders..."
            rows={3}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#15293A',
              border: `2px solid ${errors.targetAudience ? '#EF4444' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '16px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#29BD98'}
            onBlur={(e) => !errors.targetAudience && (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
          />
          {errors.targetAudience && (
            <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '8px' }}>
              {errors.targetAudience}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '40px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '12px'
          }}>
            What action do you want visitors to take? <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: '400' }}>(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.callToAction}
            onChange={(e) => setFormData({ ...formData, callToAction: e.target.value })}
            placeholder="e.g., Sign up, Download, Buy now, Join waitlist..."
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#15293A',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#29BD98'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
        </div>

        {/* Tip Box */}
        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(41, 189, 152, 0.1)',
          border: '1px solid rgba(41, 189, 152, 0.3)',
          borderRadius: '12px',
          marginBottom: '32px',
          display: 'flex',
          gap: '12px'
        }}>
          <FaLightbulb style={{ color: '#29BD98', fontSize: '20px', flexShrink: 0 }} />
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#29BD98',
              marginBottom: '6px'
            }}>
              Pro Tip
            </div>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.5'
            }}>
              Great landing pages have a clear value proposition and a single, focused call-to-action. Keep it simple!
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'space-between'
        }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/get-started')}
            style={{
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '16px 32px',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            style={{
              background: 'linear-gradient(135deg, #29BD98, #2497F9)',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Continue <FaArrowRight />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPageStep1;
