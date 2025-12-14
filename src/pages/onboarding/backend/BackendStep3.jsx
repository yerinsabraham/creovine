import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';
import ChipGroup from '../../../components/common/ChipGroup';
import logo from '../../../assets/logo.png';

const BackendStep3 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  // Check for add-ons
  const addOns = projectData?.addOns || [];
  const hasAuthentication = addOns.some(a => a.id === 'authentication');
  const hasPayment = addOns.some(a => a.id === 'payment');
  const hasAPIIntegration = addOns.some(a => a.id === 'api-integration');

  const [formData, setFormData] = useState({
    endpointTypes: projectData?.backend?.endpointTypes || [],
    customEndpoints: projectData?.backend?.customEndpoints || '',
    externalApis: projectData?.backend?.externalApis || [],
    externalApisOther: projectData?.backend?.externalApisOther || '',
    backgroundJobs: projectData?.backend?.backgroundJobs || false,
    backgroundJobTypes: projectData?.backend?.backgroundJobTypes || [],
    fileUploads: projectData?.backend?.fileUploads || false,
    realtime: projectData?.backend?.realtime || false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAndExit = async () => {
    await updatePhaseData('backend', {
      ...projectData?.backend,
      ...formData,
      currentStep: 3
    });
    navigate('/dashboard');
  };

  const handleContinue = async () => {
    await updatePhaseData('backend', {
      ...projectData?.backend,
      ...formData
    });
    navigate('/onboarding/backend/step4');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Validation - At least select endpoint types or use assist
  const isEndpointsValid = formData.endpointTypes.length > 0 || hasItem('api-design-assist');
  const isFormValid = isEndpointsValid;

  const endpointTypes = [
    'User CRUD',
    'Authentication',
    'Product CRUD',
    'Order management',
    'Payment processing',
    'File uploads',
    'Search & filtering',
    'Admin operations',
    'Analytics/reporting',
    'Notifications',
    'Webhooks',
    'Custom'
  ];

  const externalApiOptions = [
    'Stripe/Payment gateway',
    'Email service (SendGrid, etc.)',
    'SMS service (Twilio, etc.)',
    'Cloud storage (S3, etc.)',
    'Maps/Location (Google Maps)',
    'Social auth (Google, Facebook)',
    'Analytics (Mixpanel, etc.)',
    'AI/ML APIs',
    'Other'
  ];

  const backgroundJobTypes = [
    'Email sending',
    'Report generation',
    'Data sync',
    'Cleanup tasks',
    'Notifications',
    'Payment processing',
    'File processing',
    'Scheduled tasks'
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
            style={{ height: isMobile ? '28px' : '32px', cursor: 'pointer' }}
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
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
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
                cursor: 'pointer'
              }}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              style={{
                flex: 1,
                height: '8px',
                backgroundColor: step <= 3 ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'right' }}>
          Step 3 of 4
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
          <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              API & Services
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Define your API endpoints and integrations
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* API Endpoints */}
            <AssistedToggle
              id="api-design-assist"
              category="Backend"
              label="Need help designing your API?"
              price={45}
              assistedLabel="Design for me"
              tooltipText="We'll design a RESTful or GraphQL API based on your requirements with proper documentation."
            />

            {!hasItem('api-design-assist') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  What types of endpoints do you need? *
                </label>
                <ChipGroup
                  options={endpointTypes}
                  selectedValues={formData.endpointTypes}
                  onChange={(values) => handleInputChange('endpointTypes', values)}
                  multiSelect={true}
                />
                
                {formData.endpointTypes.includes('Custom') && (
                  <div style={{ marginTop: '16px' }}>
                    <textarea
                      value={formData.customEndpoints}
                      onChange={(e) => handleInputChange('customEndpoints', e.target.value)}
                      placeholder="Describe your custom endpoints..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        fontSize: '16px',
                        color: '#FFFFFF',
                        backgroundColor: '#15293A',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Authentication Add-on */}
            {hasAuthentication && (
              <div style={{
                marginBottom: '32px',
                padding: '16px 20px',
                backgroundColor: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                  <div>
                    <div style={{ fontWeight: '600', color: '#FFFFFF', marginBottom: '4px' }}>
                      Authentication Add-on Selected
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      Auth endpoints (login, register, password reset, token refresh) will be included
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Add-on */}
            {hasPayment && (
              <div style={{
                marginBottom: '32px',
                padding: '16px 20px',
                backgroundColor: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                  <div>
                    <div style={{ fontWeight: '600', color: '#FFFFFF', marginBottom: '4px' }}>
                      Payment Integration Add-on Selected
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      Payment endpoints and webhook handlers will be included
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* External API Integrations */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Any external APIs to integrate? (Optional)
              </label>
              <ChipGroup
                options={externalApiOptions}
                selectedValues={formData.externalApis}
                onChange={(values) => handleInputChange('externalApis', values)}
                multiSelect={true}
              />
              
              {formData.externalApis.includes('Other') && (
                <div style={{ marginTop: '16px' }}>
                  <input
                    type="text"
                    value={formData.externalApisOther}
                    onChange={(e) => handleInputChange('externalApisOther', e.target.value)}
                    placeholder="Specify other APIs..."
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      fontSize: '16px',
                      color: '#FFFFFF',
                      backgroundColor: '#15293A',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              )}
            </div>

            {/* API Integration Add-on */}
            {hasAPIIntegration && (
              <div style={{
                marginBottom: '32px',
                padding: '16px 20px',
                backgroundColor: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                  <div>
                    <div style={{ fontWeight: '600', color: '#FFFFFF', marginBottom: '4px' }}>
                      API Integration Add-on Selected
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      Third-party API integration and documentation will be included
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Background Jobs */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Do you need background jobs/workers?
              </label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                {['Yes', 'No', 'Not sure'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('backgroundJobs', option)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.backgroundJobs === option ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.backgroundJobs === option 
                        ? 'rgba(99, 102, 241, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.backgroundJobs === option 
                        ? '2px solid #6366F1' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {formData.backgroundJobs === 'Yes' && (
                <div style={{ marginTop: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '8px'
                  }}>
                    What types of background jobs?
                  </label>
                  <ChipGroup
                    options={backgroundJobTypes}
                    selectedValues={formData.backgroundJobTypes}
                    onChange={(values) => handleInputChange('backgroundJobTypes', values)}
                    multiSelect={true}
                  />
                </div>
              )}
            </div>

            {/* File Uploads */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Do you need file upload functionality?
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['Yes', 'No'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('fileUploads', option === 'Yes')}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.fileUploads === (option === 'Yes') ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.fileUploads === (option === 'Yes') 
                        ? 'rgba(99, 102, 241, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.fileUploads === (option === 'Yes') 
                        ? '2px solid #6366F1' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Do you need real-time features (WebSockets)?
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['Yes', 'No', 'Maybe'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('realtime', option)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.realtime === option ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.realtime === option 
                        ? 'rgba(99, 102, 241, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.realtime === option 
                        ? '2px solid #6366F1' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '48px',
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => navigate('/onboarding/backend/step2')}
                style={{
                  padding: isMobile ? '14px 24px' : '16px 32px',
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>

              <div style={{ display: 'flex', gap: '12px', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveAndExit}
                  style={{
                    padding: isMobile ? '14px 24px' : '16px 32px',
                    fontSize: isMobile ? '15px' : '16px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Save & Exit
                </motion.button>

                <motion.button
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  onClick={handleContinue}
                  disabled={!isFormValid}
                  style={{
                    padding: isMobile ? '14px 32px' : '16px 48px',
                    fontSize: isMobile ? '15px' : '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    background: isFormValid
                      ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: isFormValid ? 'pointer' : 'not-allowed',
                    opacity: isFormValid ? 1 : 0.5
                  }}
              >
                Continue to Step 4
              </motion.button>
            </div>
          </div>
          </div>
        </motion.div>
      </div>

      <CartSummary />
    </div>
  );
};

export default BackendStep3;
